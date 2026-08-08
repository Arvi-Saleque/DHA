import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

// Written to only by middleware.ts (via INTERNAL_API_SECRET) right after it
// verifies a write request's session, so entries can't be forged by callers
// who only hold a normal admin session token.
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-internal-secret");
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const { userId, role, method, path, ip } = await request.json();
    await connectDB();
    await AuditLog.create({ userId, role, method, path, ip });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Audit log write error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const logs = await AuditLog.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Audit log fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
