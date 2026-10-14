import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getOrderNumberBySessionId } from "@/lib/orders-db";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // The webhook may not have written the order row yet; the success page
    // falls back to a short session code until it appears.
    let orderNumber: string | null = null;
    try {
      orderNumber = await getOrderNumberBySessionId(sessionId);
    } catch (err) {
      console.error("Could not look up order number:", err);
    }

    return NextResponse.json({
      amountTotal: session.amount_total != null ? session.amount_total / 100 : null,
      currency: session.currency,
      orderNumber,
    });
  } catch (err) {
    console.error("Failed to retrieve checkout session:", err);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
