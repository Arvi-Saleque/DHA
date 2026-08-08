import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE_NAME = 'admin_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Exact API paths that never require authentication, regardless of method.
const PUBLIC_PATHS = new Set(['/api/auth/login', '/api/auth/logout']);

// Non-GET (write) requests that must stay public even though their path is
// otherwise admin-protected by default (e.g. public form submissions, and
// the audit-log sink itself, which authenticates via a shared secret instead
// of a user session).
const PUBLIC_WRITES = new Set([
  'POST /api/contact-messages',
  'POST /api/newsletter',
  'POST /api/reviews',
  'POST /api/audit-log',
]);

// GET requests that must stay admin-protected even though GET is public by
// default (these return non-public data: messages, subscriber emails, etc.).
const PROTECTED_READS = new Set([
  '/api/contact-messages',
  '/api/newsletter',
  '/api/users',
  '/api/cloudinary-images',
  '/api/audit-log',
]);

function isPublicRequest(request: NextRequest, pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;

  if (request.method === 'GET') {
    if (pathname === '/api/reviews' && request.nextUrl.searchParams.get('admin') === 'true') {
      return false;
    }
    return !PROTECTED_READS.has(pathname);
  }

  return PUBLIC_WRITES.has(`${request.method} ${pathname}`);
}

async function getSession(
  request: NextRequest
): Promise<{ userId: string; role: string } | null> {
  const bearer = request.headers.get('authorization');
  const token = bearer?.startsWith('Bearer ')
    ? bearer.slice(7)
    : request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: String(payload.userId), role: String(payload.role) };
  } catch {
    return null;
  }
}

function logAuditEntry(
  request: NextRequest,
  event: NextFetchEvent,
  session: { userId: string; role: string },
  pathname: string
) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  event.waitUntil(
    fetch(new URL('/api/audit-log', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': process.env.INTERNAL_API_SECRET || '',
      },
      body: JSON.stringify({
        userId: session.userId,
        role: session.role,
        method: request.method,
        path: pathname,
        ip,
      }),
    }).catch(() => {})
  );
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const origin = request.headers.get('origin');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  const pathname = request.nextUrl.pathname;
  const isPublic = isPublicRequest(request, pathname);

  let session: { userId: string; role: string } | null = null;
  if (!isPublic) {
    session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  // Record write actions by authenticated users, excluding the audit-log
  // sink itself (which isn't user-session-backed) to avoid recursive noise.
  if (session && request.method !== 'GET' && pathname !== '/api/audit-log') {
    logAuditEntry(request, event, session, pathname);
  }

  const response = NextResponse.next();

  // Allow requests from any localhost port (for Flutter web development)
  if (origin && origin.includes('localhost')) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
