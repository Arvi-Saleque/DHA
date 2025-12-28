import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST() {
  try {
    await connectDB();
    
    // Drop the galleryimages collection
    await mongoose.connection.db?.dropCollection("galleryimages");
    
    return NextResponse.json({
      success: true,
      message: "Gallery collection dropped successfully. New one will be created with updated schema.",
    });
  } catch (error: any) {
    if (error.message.includes("ns not found")) {
      return NextResponse.json({
        success: true,
        message: "Collection does not exist, nothing to drop.",
      });
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
