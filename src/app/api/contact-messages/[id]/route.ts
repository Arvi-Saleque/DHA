import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

// PATCH - Update message status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message });
  } catch (error: unknown) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to update message", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Message deleted successfully" 
    });
  } catch (error: unknown) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to delete message", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
