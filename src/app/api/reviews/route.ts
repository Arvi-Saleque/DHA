import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({ isActive: true }).sort({ order: 1 });
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
    const deleteAll = searchParams.get("deleteAll");
    
    // Delete all reviews
    if (deleteAll === "true") {
      await Review.deleteMany({});
      return NextResponse.json({ message: "All reviews deleted successfully" });
    }
    
    // Delete single review
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
