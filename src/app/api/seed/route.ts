import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "super_admin" });
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: "Admin user already exists",
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
        },
      });
    }

    // Create default admin user
    const hashedPassword = await hashPassword("admin123");

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@madrasa.edu",
      password: hashedPassword,
      role: "super_admin",
      phone: "+92-XXX-XXXXXXX",
      designation: "System Administrator",
      department: "Administration",
      isActive: true,
    });

    // Create sample teacher
    const teacherPassword = await hashPassword("teacher123");
    const teacher = await User.create({
      name: "Mr. Ahmed Khan",
      email: "teacher@madrasa.edu",
      password: teacherPassword,
      role: "teacher",
      phone: "+92-XXX-XXXXXXX",
      designation: "Senior Teacher",
      department: "Islamic Studies",
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      users: [
        {
          email: admin.email,
          password: "admin123",
          role: admin.role,
        },
        {
          email: teacher.email,
          password: "teacher123",
          role: teacher.role,
        },
      ],
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
