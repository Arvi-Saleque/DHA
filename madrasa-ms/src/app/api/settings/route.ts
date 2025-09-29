import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySessionJWT } from "@/lib/auth";
import { z } from "zod";

// Helper to read the session cookie and verify
async function requireAuth(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) throw new Error("No session");
  const token = decodeURIComponent(m[1]);
  return await verifySessionJWT(token);
}

// Read current settings (no auth required for read)
export async function GET() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return NextResponse.json({ headerTitle: settings?.headerTitle ?? "" });
}

// Update header title (auth required)
export async function PUT(req: Request) {
  try {
    await requireAuth(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = z.object({ headerTitle: z.string().min(1).max(120) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { headerTitle } = parsed.data;
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: { headerTitle },
    create: { id: 1, headerTitle },
  });

  return NextResponse.json({ success: true });
}
