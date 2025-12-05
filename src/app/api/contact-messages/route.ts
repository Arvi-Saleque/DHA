import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

// GET all contact messages
export async function GET() {
  try {
    await connectDB();
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json({ success: true, messages });
  } catch (error: unknown) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch contact messages", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// POST - Create new contact message
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { name, email, phone, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields" },
        { status: 400 }
      );
    }
    
    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
      status: "unread",
    });

    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully",
      data: contactMessage 
    });
  } catch (error: unknown) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to send message", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
