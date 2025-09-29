import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<{ now: Date }[]>`SELECT now() AS now`;
    return NextResponse.json({ ok: true, dbTime: rows?.[0]?.now ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
