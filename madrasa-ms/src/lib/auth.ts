import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export type Session = { sub: string; username: string };

export async function createSessionJWT(payload: Session) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionJWT(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as Session;
}
