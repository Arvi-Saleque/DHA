import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NewsEvent from "@/models/NewsEvent";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;
    const newsEvent = await NewsEvent.findOne({ slug });

    if (!newsEvent) {
      return NextResponse.json(
        { message: "News/Event not found" },
        { status: 404 }
      );
    }

    // Increment view count
    newsEvent.views += 1;
    await newsEvent.save();

    return NextResponse.json(newsEvent);
  } catch (error: any) {
    console.error("Error fetching news/event:", error);
    return NextResponse.json(
      { message: "Failed to fetch news/event", error: error.message },
      { status: 500 }
    );
  }
}
