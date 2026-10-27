import { NextRequest, NextResponse } from "next/server";
import {
  CUSTOMER_COOKIE,
  CUSTOMER_SESSION_MAX_AGE_SECONDS,
  createCustomerToken,
  verifyPassword,
} from "@/lib/customer-auth";
import {
  getCustomerByEmail,
  isCustomerLoginRateLimited,
  recordCustomerLoginAttempt,
} from "@/lib/customers-db";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  try {
    // Throttle before checking the password, so a brute force cannot get
    // unlimited guesses. Mirrors the admin login.
    if (await isCustomerLoginRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }
  } catch (err) {
    console.error("Customer login rate-limit check failed:", err);
    return NextResponse.json({ error: "Sign in unavailable." }, { status: 500 });
  }

  try {
    const { email, password } = (await req.json()) as Record<string, unknown>;
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const customer = await getCustomerByEmail(email);

    // Verify against a dummy hash when no account exists, so a missing
    // account and a wrong password take the same time. Returning early
    // would make account enumeration a stopwatch exercise.
    const stored =
      customer?.passwordHash ??
      "pbkdf2$210000$00000000000000000000000000000000$" + "0".repeat(64);
    const ok = await verifyPassword(password, stored);

    if (!customer || !ok) {
      await recordCustomerLoginAttempt(ip, false);
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    await recordCustomerLoginAttempt(ip, true);

    const res = NextResponse.json({ ok: true, status: customer.status });
    res.cookies.set(CUSTOMER_COOKIE, await createCustomerToken(customer.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: CUSTOMER_SESSION_MAX_AGE_SECONDS,
    });
    return res;
  } catch (err: unknown) {
    console.error("Account login failed:", err);
    return NextResponse.json({ error: "Could not sign you in." }, { status: 500 });
  }
}
