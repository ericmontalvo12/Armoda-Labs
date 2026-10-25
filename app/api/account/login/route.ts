import { NextResponse } from "next/server";
import {
  CUSTOMER_COOKIE,
  CUSTOMER_SESSION_MAX_AGE_SECONDS,
  createCustomerToken,
  verifyPassword,
} from "@/lib/customer-auth";
import { getCustomerByEmail } from "@/lib/customers-db";

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as Record<string, unknown>;
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
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
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const res = NextResponse.json({
      ok: true,
      status: customer.status,
    });
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
