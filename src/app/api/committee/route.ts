import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Committee from "@/models/Committee";

// GET: Fetch active committee data
export async function GET() {
  try {
    await connectDB();

    const committee = await Committee.findOne({ isActive: true });

    if (!committee) {
      return NextResponse.json(
        { message: "Committee data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(committee);
  } catch (error) {
    console.error("Error fetching committee data:", error);
    return NextResponse.json(
      { message: "Failed to fetch committee data" },
      { status: 500 }
    );
  }
}

// POST: Create new committee data
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Deactivate existing committee data
    await Committee.updateMany({}, { isActive: false });

    const committee = await Committee.create({
      ...body,
      isActive: true,
    });

    return NextResponse.json(
      { message: "Committee data created successfully", committee },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating committee data:", error);
    return NextResponse.json(
      { message: "Failed to create committee data" },
      { status: 500 }
    );
  }
}

// PUT: Update existing committee data
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { message: "Committee ID is required" },
        { status: 400 }
      );
    }

    const committee = await Committee.findByIdAndUpdate(
      _id,
      { ...updateData, isActive: true },
      { new: true, runValidators: true }
    );

    if (!committee) {
      return NextResponse.json(
        { message: "Committee data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Committee data updated successfully",
      committee,
    });
  } catch (error) {
    console.error("Error updating committee data:", error);
    return NextResponse.json(
      { message: "Failed to update committee data" },
      { status: 500 }
    );
  }
}

// DELETE: Delete committee data
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Committee ID is required" },
        { status: 400 }
      );
    }

    const committee = await Committee.findByIdAndDelete(id);

    if (!committee) {
      return NextResponse.json(
        { message: "Committee data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Committee data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting committee data:", error);
    return NextResponse.json(
      { message: "Failed to delete committee data" },
      { status: 500 }
    );
  }
}
