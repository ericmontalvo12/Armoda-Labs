import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) as { password?: string };
    const sitePassword = process.env.SITE_PASSWORD;

    if (!sitePassword) {
      return NextResponse.json({ ok: true });
    }

    if (password === sitePassword) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
