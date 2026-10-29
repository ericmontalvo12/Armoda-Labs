import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE, CUSTOMER_HINT_COOKIE } from "@/lib/customer-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(CUSTOMER_HINT_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
