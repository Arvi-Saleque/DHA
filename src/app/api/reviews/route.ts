import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET() {
  try {
    await connectDB();
    let reviews = await Review.find({ isActive: true }).sort({ order: 1 });
    
    // If no reviews exist, create default ones
    if (reviews.length === 0) {
      const defaultReviews = [
        {
          name: "Fatima Ahmed",
          relation: "Mother of Grade 9 Student",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
          rating: 5,
          review: "The education quality at this madrasa is exceptional. My son has shown tremendous improvement not just in Islamic studies but also in his overall character development. The teachers are dedicated and caring.",
          order: 1,
          isActive: true,
        },
        {
          name: "Abdul Rahman Khan",
          relation: "Father of Grade 10 Student",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
          rating: 5,
          review: "We are extremely satisfied with the holistic approach to education. The balance between modern academics and traditional Islamic teaching is perfect. Highly recommend this institution.",
          order: 2,
          isActive: true,
        },
        {
          name: "Aisha Begum",
          relation: "Guardian of Grade 8 Student",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
          rating: 5,
          review: "The management and staff are very professional and supportive. My daughter feels safe and motivated to learn. The extracurricular activities have helped her build confidence and leadership skills.",
          order: 3,
          isActive: true,
        },
        {
          name: "Muhammad Hassan",
          relation: "Father of Grade 11 Student",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
          rating: 5,
          review: "Outstanding faculty and excellent facilities. My son has excelled in his Quranic studies and has also developed strong analytical skills. The teachers genuinely care about each student's progress.",
          order: 4,
          isActive: true,
        },
        {
          name: "Zainab Ibrahim",
          relation: "Mother of Grade 9 Student",
          image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
          rating: 5,
          review: "This madrasa has exceeded our expectations in every way. The structured curriculum, moral guidance, and academic excellence have helped shape my daughter into a well-rounded individual. Truly grateful!",
          order: 5,
          isActive: true,
        },
      ];
      
      await Review.insertMany(defaultReviews);
      reviews = await Review.find({ isActive: true }).sort({ order: 1 });
    }
    
    return NextResponse.json(reviews);
  } catch (error: unknown) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const review = await Review.create(body);
    return NextResponse.json(review);
  } catch (error: unknown) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Failed to create review", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    const review = await Review.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });
    
    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }
    
    return NextResponse.json(review);
  } catch (error: unknown) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { message: "Failed to update review", error: error instanceof Error ? error.message : String(error) },
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
      return NextResponse.json({ message: "Review ID is required" }, { status: 400 });
    }
    
    await Review.findByIdAndDelete(id);
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { message: "Failed to delete review", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
