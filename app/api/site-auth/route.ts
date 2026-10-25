import { NextResponse } from "next/server";
import {
  SITE_GATE_COOKIE,
  SITE_GATE_MAX_AGE_SECONDS,
  createGateToken,
  sitePassword,
} from "@/lib/site-gate";
import { safeEquals } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) as { password?: string };
    const secret = sitePassword();

    // No password configured means the gate is off, so there is nothing to
    // let the caller through - middleware never sent them here.
    if (!secret) return NextResponse.json({ ok: true });

    if (!password || !(await safeEquals(password, secret))) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SITE_GATE_COOKIE, await createGateToken(secret), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SITE_GATE_MAX_AGE_SECONDS,
    });
    return res;
  } catch (err) {
    console.error("Site gate auth failed:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
