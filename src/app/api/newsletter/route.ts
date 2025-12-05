import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

// GET all newsletter subscribers
export async function GET() {
  try {
    await connectDB();
    const subscribers = await Newsletter.find({ status: "active" })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      subscribers,
      count: subscribers.length 
    });
  } catch (error: unknown) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch subscribers", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

// POST - Subscribe to newsletter
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.status === "unsubscribed") {
        // Reactivate subscription
        existingSubscriber.status = "active";
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();
        
        return NextResponse.json({ 
          success: true, 
          message: "Welcome back! You have been resubscribed to our newsletter.",
          subscriber: existingSubscriber 
        });
      }
      
      return NextResponse.json(
        { success: false, message: "This email is already subscribed" },
        { status: 400 }
      );
    }
    
    const subscriber = await Newsletter.create({
      email,
      status: "active",
    });

    return NextResponse.json({ 
      success: true, 
      message: "Successfully subscribed to newsletter!",
      subscriber 
    });
  } catch (error: unknown) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to subscribe to newsletter", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
