import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NextExam from "@/models/NextExam";
import { sendAutomaticNotification } from '@/lib/newsletter';

export async function GET() {
  try {
    await connectDB();

    const exams = await NextExam.find({ isActive: true })
      .sort({ date: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: exams.length,
      exams,
    });
  } catch (error: any) {
    console.error("❌ Error fetching next exams:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch next exams", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { date, subject, time, duration, room, grade } = body;

    if (!date || !subject || !time || !duration || !room || !grade) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const exam = await NextExam.create({
      date,
      subject,
      time,
      duration,
      room,
      grade,
      isActive: true,
    }) as any;
    
    // Send automatic notification to subscribers
    await sendAutomaticNotification({
      type: 'academic',
      title: 'New Exam Scheduled',
      message: `${subject} exam scheduled for ${grade} on ${new Date(date).toLocaleDateString()} at ${time}.`,
      link: `/next-exam`
    });

    return NextResponse.json(
      { success: true, message: "Exam created successfully", exam },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creating next exam:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create next exam", error: error.message },
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
        { success: false, message: "Exam ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { date, subject, time, duration, room, grade } = body;

    const exam = await NextExam.findByIdAndUpdate(
      id,
      {
        date,
        subject,
        time,
        duration,
        room,
        grade,
      },
      { new: true, runValidators: true }
    );

    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Exam updated successfully",
      exam,
    });
  } catch (error: any) {
    console.error("❌ Error updating next exam:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update next exam", error: error.message },
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
        { success: false, message: "Exam ID is required" },
        { status: 400 }
      );
    }

    const exam = await NextExam.findByIdAndDelete(id);

    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Exam deleted permanently",
    });
  } catch (error: any) {
    console.error("❌ Error deleting next exam:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete next exam", error: error.message },
      { status: 500 }
    );
  }
}
