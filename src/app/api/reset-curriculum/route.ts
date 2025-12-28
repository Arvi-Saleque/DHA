import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST() {
  try {
    await connectDB();
    
    // Drop the curriculums collection
    await mongoose.connection.db.dropCollection("curricula");
    
    return NextResponse.json({
      success: true,
      message: "Curriculum collection dropped successfully. New one will be created with updated schema (Pre Hifz, Hifz, Post Hifz).",
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
