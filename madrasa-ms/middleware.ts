import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionJWT } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  if (url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("session")?.value;
    if (!token) return NextResponse.redirect(new URL("/admin/login", url));
    try {
      await verifySessionJWT(token);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
