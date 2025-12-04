import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HomePage from "@/models/HomePage";

export async function GET() {
  try {
    await connectDB();
    let homePage = await HomePage.findOne();
    
    // If no data exists, create default
    if (!homePage) {
      homePage = await HomePage.create({
        statsSection: [
          { value: "500+", label: "Students", order: 1 },
          { value: "50+", label: "Teachers", order: 2 },
          { value: "20+", label: "Years", order: 3 },
          { value: "95%", label: "Success Rate", order: 4 },
        ],
        excellenceSection: {
          badge: "Why Choose Us",
          title: "Excellence in Education",
          description: "Committed to providing quality education with strong moral values",
          features: [
            {
              icon: "GraduationCap",
              title: "Qualified Teachers",
              description: "Experienced and dedicated faculty committed to student success",
              order: 1,
            },
            {
              icon: "BookOpen",
              title: "Modern Curriculum",
              description: "Updated syllabus combining traditional and modern education",
              order: 2,
            },
            {
              icon: "Trophy",
              title: "Proven Results",
              description: "Consistent track record of academic excellence and achievements",
              order: 3,
            },
            {
              icon: "Target",
              title: "Holistic Approach",
              description: "Focus on academic, moral, and character development",
              order: 4,
            },
            {
              icon: "Heart",
              title: "Safe Environment",
              description: "Secure and nurturing atmosphere for optimal learning",
              order: 5,
            },
            {
              icon: "Star",
              title: "Individual Attention",
              description: "Personalized approach to address each student's unique needs",
              order: 6,
            },
          ],
        },
      });
    }
    
    return NextResponse.json(homePage);
  } catch (error: unknown) {
    console.error("Error fetching homepage:", error);
    return NextResponse.json(
      { message: "Failed to fetch homepage", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log("Updating homepage:", body);

    let homePage = await HomePage.findOne();
    
    if (!homePage) {
      homePage = await HomePage.create(body);
    } else {
      homePage = await HomePage.findByIdAndUpdate(
        homePage._id,
        body,
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json(homePage);
  } catch (error: unknown) {
    console.error("Error updating homepage:", error);
    return NextResponse.json(
      { message: "Failed to update homepage", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
