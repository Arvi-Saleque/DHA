import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HeaderSlide from "@/models/HeaderSlide";

export async function GET() {
  try {
    await connectDB();
    const slides = await HeaderSlide.find({ isActive: true }).sort({ order: 1 });
    
    // If no slides exist, create defaults
    if (slides.length === 0) {
      const defaultSlides = await HeaderSlide.insertMany([
        {
          image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070",
          title: "Welcome to Our Madrasa",
          subtitle: "Building Knowledge, Nurturing Faith",
          description: "Excellence in Islamic education with modern teaching methods",
          primaryButton: "Enroll Now",
          secondaryButton: "Learn More",
          order: 1,
          isActive: true,
        },
        {
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022",
          title: "Quality Islamic Education",
          subtitle: "Empowering Future Scholars",
          description: "Comprehensive curriculum combining traditional and contemporary learning",
          primaryButton: "View Programs",
          secondaryButton: "Contact Us",
          order: 2,
          isActive: true,
        },
        {
          image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032",
          title: "Join Our Community",
          subtitle: "Where Learning Meets Purpose",
          description: "Experienced teachers dedicated to your child's spiritual and academic growth",
          primaryButton: "Get Started",
          secondaryButton: "Our Faculty",
          order: 3,
          isActive: true,
        },
      ]);
      return NextResponse.json(defaultSlides);
    }
    
    return NextResponse.json(slides);
  } catch (error: unknown) {
    console.error("Error fetching slides:", error);
    return NextResponse.json(
      { message: "Failed to fetch slides", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log("Creating slide:", body);

    const slide = await HeaderSlide.create(body);
    return NextResponse.json(slide);
  } catch (error: unknown) {
    console.error("Error creating slide:", error);
    return NextResponse.json(
      { message: "Failed to create slide", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    console.log("Updating slide:", _id, updateData);

    const slide = await HeaderSlide.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!slide) {
      return NextResponse.json({ message: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json(slide);
  } catch (error: unknown) {
    console.error("Error updating slide:", error);
    return NextResponse.json(
      { message: "Failed to update slide", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Slide ID required" }, { status: 400 });
    }

    const slide = await HeaderSlide.findByIdAndDelete(id);

    if (!slide) {
      return NextResponse.json({ message: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Slide deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting slide:", error);
    return NextResponse.json(
      { message: "Failed to delete slide", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
