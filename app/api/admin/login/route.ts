import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  safeEquals,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin-auth";
import { isLoginRateLimited, recordLoginAttempt } from "@/lib/orders-db";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error("ADMIN_PASSWORD is not set");
    return NextResponse.json(
      { error: "Admin login is not configured." },
      { status: 500 }
    );
  }

  const ip = clientIp(req);

  // Throttle before checking the password, so a brute force can't get
  // unlimited guesses.
  try {
    if (await isLoginRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }
  } catch (err) {
    console.error("Login rate-limit check failed:", err);
    return NextResponse.json({ error: "Login unavailable." }, { status: 500 });
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    // fall through to the failure path
  }

  const ok = typeof password === "string" && (await safeEquals(password, expected));
  await recordLoginAttempt(ip, ok).catch(() => {});

  if (!ok) {
    // Deliberately vague - no hint about whether anything was close.
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
