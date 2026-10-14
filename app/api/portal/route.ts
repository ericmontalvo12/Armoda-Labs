import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("Missing STRIPE_SECRET_KEY");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) throw new Error("Missing NEXT_PUBLIC_SITE_URL");

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.mode !== "subscription" || !session.customer) {
      return NextResponse.json({ isSubscription: false });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.customer as string,
      configuration: "bpc_1TCqCYBksrAsWXjdVtoCmRpB",
      return_url: `${siteUrl}/success?session_id=${sessionId}`,
    });

    return NextResponse.json({ isSubscription: true, url: portalSession.url });
  } catch (err: unknown) {
    console.error("Portal session error:", err);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
