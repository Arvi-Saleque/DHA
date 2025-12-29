import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Syllabus from "@/models/Syllabus";

export async function DELETE() {
  try {
    await connectDB();
    const result = await Syllabus.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} syllabus documents`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("Error deleting syllabus:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
