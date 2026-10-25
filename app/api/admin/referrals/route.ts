import { NextRequest, NextResponse } from "next/server";
import {
  listReferrals,
  approveReferral,
  rejectReferral,
  getReferralEarnings,
} from "@/lib/customers-db";

// Auth is handled centrally by middleware.ts, which matches /api/admin/:path*.

// Codes are typed into a checkout field by hand, so they are restricted to
// characters that survive being read off a screen and retyped: no lowercase,
// no punctuation beyond a dash.
const CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{2,23}$/;

export async function GET() {
  try {
    const referrals = await listReferrals();
    // Earnings are recomputed per approved code rather than stored, so a
    // refunded order stops counting the moment its status changes.
    const withEarnings = await Promise.all(
      referrals.map(async (referral) => ({
        ...referral,
        earnings:
          referral.status === "approved" && referral.code
            ? await getReferralEarnings(referral.code, referral.rateBps)
            : null,
      }))
    );
    return NextResponse.json({ referrals: withEarnings });
  } catch (err) {
    console.error("Failed to list referrals:", err);
    return NextResponse.json(
      { error: "Failed to load referrals." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = Number(body?.id);
    const action = body?.action;

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid referral id." }, { status: 400 });
    }

    if (action === "reject") {
      await rejectReferral(id);
      return NextResponse.json({ ok: true });
    }

    if (action === "approve") {
      const code = String(body?.code ?? "").trim().toUpperCase();
      if (!CODE_PATTERN.test(code)) {
        return NextResponse.json(
          {
            error:
              "Code must be 3-24 characters, letters, numbers and dashes only.",
          },
          { status: 400 }
        );
      }
      try {
        await approveReferral(id, code);
      } catch (err: any) {
        // Unique violation on referrals_code_key: another affiliate already
        // holds this code. Reusing it would merge two people's attribution.
        if (err?.code === "23505") {
          return NextResponse.json(
            { error: "That code is already in use." },
            { status: 409 }
          );
        }
        throw err;
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    console.error("Failed to update referral:", err);
    return NextResponse.json(
      { error: "Failed to update referral." },
      { status: 500 }
    );
  }
}
