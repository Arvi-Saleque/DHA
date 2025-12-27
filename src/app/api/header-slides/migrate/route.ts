import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HeaderSlide from "@/models/HeaderSlide";

export async function POST() {
  try {
    await connectDB();
    
    // Delete all existing slides
    await HeaderSlide.deleteMany({});
    console.log("Deleted all existing header slides");

    // Insert new slides with URL fields
    const defaultSlides = await HeaderSlide.insertMany([
      {
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070",
        title: "Welcome to Our Madrasa",
        subtitle: "Building Knowledge, Nurturing Faith",
        description: "Excellence in Islamic education with modern teaching methods",
        primaryButton: "Enroll Now",
        primaryButtonUrl: "/admission",
        secondaryButton: "Learn More",
        secondaryButtonUrl: "/about",
        order: 1,
        isActive: true,
      },
      {
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022",
        title: "Quality Islamic Education",
        subtitle: "Empowering Future Scholars",
        description: "Comprehensive curriculum combining traditional and contemporary learning",
        primaryButton: "View Programs",
        primaryButtonUrl: "/academic",
        secondaryButton: "Contact Us",
        secondaryButtonUrl: "/contact",
        order: 2,
        isActive: true,
      },
      {
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032",
        title: "Join Our Community",
        subtitle: "Where Learning Meets Purpose",
        description: "Experienced teachers dedicated to your child's spiritual and academic growth",
        primaryButton: "Get Started",
        primaryButtonUrl: "/admission",
        secondaryButton: "Our Faculty",
        secondaryButtonUrl: "/about/teachers",
        order: 3,
        isActive: true,
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Header slides migrated successfully",
      count: defaultSlides.length,
      slides: defaultSlides,
    });
  } catch (error: unknown) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Migration failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
