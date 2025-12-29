import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AcademicCalendar from "@/models/AcademicCalendar";

export async function DELETE() {
  try {
    await connectDB();
    const result = await AcademicCalendar.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} academic calendar documents`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("Error deleting academic calendars:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}