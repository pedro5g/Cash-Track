import "server-only";
import * as jose from "jose";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/constants";

type PayLoadType = {
  id: string;
  provider: "GOOGLE" | "EMAIL";
};

export async function createSessionToken(payload: PayLoadType) {
  const secret = new TextEncoder().encode(process.env.TOKEN_SECRET_KEY);
  const session = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);

  const { exp } = await openSessionToken(session);

  (await cookies()).set(COOKIE_KEYS.TOKEN, session, {
    maxAge: exp! * 1000,
    path: "/",
    httpOnly: false,
  });
}

export async function isSessionValid() {
  const sessionCookie = (await cookies()).get(COOKIE_KEYS.TOKEN)?.value;

  if (sessionCookie) {
    const value = sessionCookie;
    const { exp } = await openSessionToken(value);
    const now = new Date().getTime();
    return exp! * 1000 > now;
  }
  return false;
}

export async function openSessionToken(token: string) {
  const secret = new TextEncoder().encode(process.env.TOKEN_SECRET_KEY);
  const { payload } = await jose.jwtVerify(token, secret);

  return payload as jose.JWTPayload & PayLoadType;
}
