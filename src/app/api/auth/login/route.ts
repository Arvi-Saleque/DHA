import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword, generateToken } from "@/lib/auth";

// Hardcoded admin credentials
const ADMIN_USERNAME = "adminDHA";
const ADMIN_PASSWORD = "D!@23h2@%A23";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Use username if provided, otherwise fall back to email for backward compatibility
    const loginIdentifier = username || email;

    // Validation
    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check hardcoded admin credentials first
    if (loginIdentifier === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = "admin-hardcoded-token-" + Date.now();
      
      return NextResponse.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: "admin",
          name: "Administrator",
          email: ADMIN_USERNAME,
          role: "admin",
          profileImage: null,
        },
      });
    }

    // If not hardcoded admin, try database authentication
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: loginIdentifier, isActive: true });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.role);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
