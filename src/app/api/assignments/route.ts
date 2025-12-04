import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Assignment from "@/models/Assignment";

export async function GET() {
  try {
    await connectDB();

    const assignments = await Assignment.find({ isActive: true })
      .sort({ deadline: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error: any) {
    console.error("❌ Error fetching assignments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch assignments", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { subject, class: className, title, description, deadline, teacherName } = body;

    if (!subject || !className || !title || !deadline || !teacherName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const assignment = await Assignment.create({
      subject,
      class: className,
      title,
      description,
      deadline,
      teacherName,
      teacher: "674d1a2b3c4d5e6f7a8b9c0d", // Default teacher ID for now
      isActive: true,
    });

    return NextResponse.json(
      { success: true, message: "Assignment created successfully", assignment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creating assignment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create assignment", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Assignment ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { subject, class: className, title, description, deadline, teacherName } = body;

    const assignment = await Assignment.findByIdAndUpdate(
      id,
      {
        subject,
        class: className,
        title,
        description,
        deadline,
        teacherName,
      },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return NextResponse.json(
        { success: false, message: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error: any) {
    console.error("❌ Error updating assignment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update assignment", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Assignment ID is required" },
        { status: 400 }
      );
    }

    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      return NextResponse.json(
        { success: false, message: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Assignment deleted permanently",
    });
  } catch (error: any) {
    console.error("❌ Error deleting assignment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete assignment", error: error.message },
      { status: 500 }
    );
  }
}
