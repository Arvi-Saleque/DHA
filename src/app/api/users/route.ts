import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}
