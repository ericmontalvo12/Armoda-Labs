import { NextRequest, NextResponse } from "next/server";
import {
  addCreditEntry,
  getCreditBalanceCents,
  listCreditEntries,
  listRecentCredit,
  InsufficientCreditError,
  CREDIT_REASONS,
} from "@/lib/store-credit-db";

// Auth is handled centrally by middleware.ts, which matches /api/admin/:path*.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** With ?email= returns that customer's balance and history, else recent activity. */
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (email) {
      const [balanceCents, entries] = await Promise.all([
        getCreditBalanceCents(email),
        listCreditEntries(email),
      ]);
      return NextResponse.json({ email, balanceCents, entries });
    }
    return NextResponse.json({ entries: await listRecentCredit() });
  } catch (err) {
    console.error("Failed to load store credit:", err);
    return NextResponse.json(
      { error: "Failed to load store credit." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim();
    const reason = String(body?.reason ?? "");
    const note = body?.note ? String(body.note).trim().slice(0, 500) : null;
    const orderId = body?.orderId != null ? Number(body.orderId) : null;

    // Amount arrives as dollars, because that is what an admin types. It is
    // converted here and stored as cents; Math.round catches 12.345.
    const amountDollars = Number(body?.amountDollars);

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!Number.isFinite(amountDollars) || amountDollars === 0) {
      return NextResponse.json(
        { error: "Enter an amount. Use a negative number to deduct." },
        { status: 400 }
      );
    }
    if (Math.abs(amountDollars) > 10_000) {
      // A guard against a slipped decimal point, not a policy limit.
      return NextResponse.json(
        { error: "Amounts over $10,000 have to be entered as several entries." },
        { status: 400 }
      );
    }
    if (!CREDIT_REASONS.includes(reason as (typeof CREDIT_REASONS)[number])) {
      return NextResponse.json({ error: "Choose a reason." }, { status: 400 });
    }
    if (orderId != null && !Number.isInteger(orderId)) {
      return NextResponse.json({ error: "Invalid order number." }, { status: 400 });
    }

    const entry = await addCreditEntry({
      email,
      amountCents: Math.round(amountDollars * 100),
      reason,
      orderId,
      note,
    });

    return NextResponse.json({
      entry,
      balanceCents: await getCreditBalanceCents(email),
    });
  } catch (err) {
    if (err instanceof InsufficientCreditError) {
      return NextResponse.json(
        {
          error: `That would take the balance below zero. Current balance is $${(
            err.balanceCents / 100
          ).toFixed(2)}.`,
        },
        { status: 409 }
      );
    }
    console.error("Failed to record store credit:", err);
    return NextResponse.json(
      { error: "Failed to record store credit." },
      { status: 500 }
    );
  }
}
