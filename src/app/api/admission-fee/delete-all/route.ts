import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AdmissionFee from "@/models/AdmissionFee";

export async function DELETE() {
  try {
    await connectDB();
    const result = await AdmissionFee.deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} admission fee records`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting admission fees:", error);
    return NextResponse.json(
      { error: "Failed to delete admission fees" },
      { status: 500 }
    );
  }
}
