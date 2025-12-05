import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

// DELETE - Unsubscribe from newsletter
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    await connectDB();
    const { email } = await params;
    
    const subscriber = await Newsletter.findOneAndUpdate(
      { email: decodeURIComponent(email) },
      { status: "unsubscribed" },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.json(
        { success: false, message: "Email not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Successfully unsubscribed from newsletter" 
    });
  } catch (error: unknown) {
    console.error("Error unsubscribing:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to unsubscribe", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
