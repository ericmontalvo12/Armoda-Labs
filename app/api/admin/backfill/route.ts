import { NextResponse } from "next/server";
import Stripe from "stripe";
import { upsertOrder, type OrderLineItem } from "@/lib/orders-db";

export const maxDuration = 60;

/**
 * Imports historical paid Checkout Sessions into the orders table.
 *
 * Orders placed before the dashboard shipped only exist in Stripe. This is
 * safe to run repeatedly - upsertOrder is idempotent on the session id and
 * never overwrites fulfilment fields.
 */
export async function POST() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "STRIPE_SECRET_KEY not set." }, { status: 500 });
    }
    const stripe = new Stripe(secretKey);

    let imported = 0;
    let scanned = 0;
    let startingAfter: string | undefined;

    // Bounded so the request can't run forever; re-run if more remain.
    for (let page = 0; page < 20; page++) {
      const sessions: Stripe.ApiList<Stripe.Checkout.Session> =
        await stripe.checkout.sessions.list({
          limit: 100,
          starting_after: startingAfter,
          expand: ["data.line_items"],
        });

      for (const session of sessions.data) {
        scanned++;
        if (session.payment_status !== "paid" || session.amount_total == null) continue;

        const shipping = session.collected_information?.shipping_details;
        const address = shipping?.address;
        const lineItems: OrderLineItem[] =
          session.line_items?.data.map((li) => ({
            description: li.description ?? "Item",
            quantity: li.quantity ?? 1,
            amountTotal: (li.amount_total ?? 0) / 100,
          })) ?? [];

        await upsertOrder({
          stripeSessionId: session.id,
          email: session.customer_details?.email ?? null,
          customerName: session.customer_details?.name ?? null,
          phone: session.customer_details?.phone ?? null,
          amountTotal: session.amount_total / 100,
          currency: session.currency ?? "usd",
          paymentStatus: session.payment_status,
          shippingName: shipping?.name ?? null,
          addressLine1: address?.line1 ?? null,
          addressLine2: address?.line2 ?? null,
          city: address?.city ?? null,
          state: address?.state ?? null,
          postalCode: address?.postal_code ?? null,
          country: address?.country ?? null,
          lineItems,
          createdAt: new Date(session.created * 1000),
        });
        imported++;
      }

      if (!sessions.has_more || sessions.data.length === 0) break;
      startingAfter = sessions.data[sessions.data.length - 1].id;
    }

    return NextResponse.json({ imported, scanned });
  } catch (err) {
    console.error("Backfill failed:", err);
    return NextResponse.json({ error: "Backfill failed." }, { status: 500 });
  }
}
