import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/customer-session";
import { applyForReferral, getReferralForCustomer } from "@/lib/customers-db";

export async function POST(req: Request) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Sign in to apply." }, { status: 401 });
    }
    // Only an approved account can apply. Letting a pending one through
    // would mean reviewing the person twice for the same question.
    if (customer.status !== "approved") {
      return NextResponse.json(
        { error: "Your account is still under review." },
        { status: 403 }
      );
    }

    const { audience } = (await req.json()) as Record<string, unknown>;
    if (typeof audience !== "string" || audience.trim().length < 20) {
      return NextResponse.json(
        { error: "Tell us where you publish and who your audience is." },
        { status: 400 }
      );
    }

    const existing = await getReferralForCustomer(customer.id);
    if (existing) {
      return NextResponse.json({ error: "You have already applied." }, { status: 409 });
    }

    await applyForReferral(customer.id, audience.trim().slice(0, 2000));
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Referral application failed:", err);
    return NextResponse.json({ error: "Could not submit the application." }, { status: 500 });
  }
}
