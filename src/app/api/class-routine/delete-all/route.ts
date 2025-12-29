import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ClassRoutine from "@/models/ClassRoutine";

export async function DELETE() {
  try {
    await connectDB();
    const result = await ClassRoutine.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} class routine documents`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("Error deleting class routines:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}