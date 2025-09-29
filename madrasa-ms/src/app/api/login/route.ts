import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import { createSessionJWT } from "@/lib/auth";
import { z } from "zod";


const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parse = schema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { username, password } = parse.data;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = await createSessionJWT({ sub: user.id, username: user.username });

  const res = NextResponse.json({ success: true });
  res.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
