import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ExamRoutine from "@/models/ExamRoutine";

export async function DELETE() {
  try {
    await connectDB();
    const result = await ExamRoutine.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} exam routine documents`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("Error deleting exam routines:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}