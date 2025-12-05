import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NewsEvent from "@/models/NewsEvent";
import { sendAutomaticNotification } from "@/lib/newsletter";

// GET: Fetch all news/events
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query: any = {};

    if (category && category !== "all") {
      query.category = category;
    }

    const newsEvents = await NewsEvent.find(query).sort({ date: -1 });

    return NextResponse.json(newsEvents);
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch news/events", error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new news/event
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("POST body:", body);

    const newsEvent = await NewsEvent.create(body) as any;
    console.log("Created:", newsEvent);

    // Auto-notify subscribers
    await sendAutomaticNotification({
      type: 'news',
      title: body.title || 'New News/Event Posted',
      message: body.excerpt || body.content?.substring(0, 200) || 'Check out the latest news and events on our website.',
      link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/news-events/${newsEvent.slug}`
    });

    return NextResponse.json(
      { message: "News/Event created successfully", newsEvent },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Failed to create news/event", error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update existing news/event
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { message: "News/Event ID is required" },
        { status: 400 }
      );
    }

    const newsEvent = await NewsEvent.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!newsEvent) {
      return NextResponse.json(
        { message: "News/Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "News/Event updated successfully",
      newsEvent,
    });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { message: "Failed to update news/event", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete news/event
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "News/Event ID is required" },
        { status: 400 }
      );
    }

    const newsEvent = await NewsEvent.findByIdAndDelete(id);

    if (!newsEvent) {
      return NextResponse.json(
        { message: "News/Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "News/Event deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { message: "Failed to delete news/event", error: error.message },
      { status: 500 }
    );
  }
}
