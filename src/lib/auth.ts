import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

// Name of the httpOnly cookie carrying the session JWT, and its max-age in
// seconds (kept in sync with JWT_EXPIRES_IN's default of 7 days). Also read
// by middleware.ts to enforce auth on admin API routes.
export const AUTH_COOKIE_NAME = "admin_session";
export const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
