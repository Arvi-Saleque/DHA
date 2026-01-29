import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NextExam from "@/models/NextExam";
import { sendAutomaticNotification } from '@/lib/newsletter';

export async function GET() {
  try {
    await connectDB();

    const exams = await NextExam.find({ isActive: true })
      .sort({ className: 1, createdAt: 1 })
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
    const { className, examName, pdfUrl, totalPages } = body;

    if (!className || !examName || !pdfUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const exam = await NextExam.create({
      className,
      examName,
      pdfUrl,
      totalPages: totalPages || 15,
      isActive: true,
    }) as any;
    
    // Send automatic notification to subscribers
    await sendAutomaticNotification({
      type: 'academic',
      title: 'New Exam Routine Published',
      message: `${examName} routine has been published for ${className}.`,
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
    const { className, examName, pdfUrl, totalPages } = body;

    const exam = await NextExam.findByIdAndUpdate(
      id,
      {
        className,
        examName,
        pdfUrl,
        totalPages: totalPages || 15,
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

    // Check if this is a delete all request
    const body = await request.json().catch(() => null);
    if (body && body.deleteAll === true) {
      const result = await NextExam.deleteMany({});
      return NextResponse.json({ 
        success: true,
        message: 'All exam routines deleted successfully',
        deletedCount: result.deletedCount 
      });
    }

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
