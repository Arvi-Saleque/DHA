import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ReviewSettings from "@/models/ReviewSettings";

export async function GET() {
  try {
    await connectDB();
    let settings = await ReviewSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await ReviewSettings.create({
        trustedByText: "Trusted by",
        familiesCount: "500+ Families",
        averageRatingText: "Average Rating",
        averageRatingValue: "5.0/5.0",
      });
    }

    return NextResponse.json(settings);
  } catch (error: unknown) {
    console.error("Error fetching review settings:", error);
    return NextResponse.json(
      { message: "Failed to fetch settings", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    let settings = await ReviewSettings.findOne();

    if (settings) {
      // Update existing settings
      settings = await ReviewSettings.findByIdAndUpdate(
        settings._id,
        body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new settings
      settings = await ReviewSettings.create(body);
    }

    return NextResponse.json(settings);
  } catch (error: unknown) {
    console.error("Error updating review settings:", error);
    return NextResponse.json(
      { message: "Failed to update settings", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
