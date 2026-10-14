import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendPurchaseToMetaCapi } from "@/lib/meta-capi";
import { SITE_URL } from "@/app/layout";
import {
  upsertOrder,
  upsertRenewalOrder,
  formatOrderNumber,
  type OrderLineItem,
} from "@/lib/orders-db";

const GHL_URLS: Record<string, string | undefined> = {
  order_confirmation: process.env.GHL_ORDER_WEBHOOK_URL,
  subscriber_welcome: process.env.GHL_SUBSCRIBER_WELCOME_WEBHOOK_URL,
  renewal: process.env.GHL_ORDER_WEBHOOK_URL,
  payment_failed: process.env.GHL_PAYMENT_FAILED_WEBHOOK_URL,
  cancellation_pending: process.env.GHL_CANCELLATION_WEBHOOK_URL,
  subscription_ended: process.env.GHL_SUBSCRIPTION_ENDED_WEBHOOK_URL,
};

async function sendToGHL(type: string, payload: Record<string, unknown>) {
  // Deliberately no fallback URL: the order-confirmation workflow sends its
  // email to anything that reaches it, so routing an unconfigured type there
  // would tell a customer whose card just declined that their order shipped.
  const ghlUrl = GHL_URLS[type];
  if (!ghlUrl) {
    console.warn(`GHL webhook URL not set for ${type} — skipping`);
    return;
  }
  try {
    await fetch(ghlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...payload }),
    });
  } catch (err) {
    console.error(`Failed to send ${type} to GHL:`, err);
  }
}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const isSubscription = session.mode === "subscription";

      console.log("=== ORDER COMPLETED ===");
      console.log("Session ID:", session.id);
      console.log("Mode:", session.mode);
      console.log("Payment Status:", session.payment_status);
      console.log("Amount Total:", session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "N/A");
      console.log("Customer Email:", session.customer_details?.email || "N/A");
      console.log("=======================");

      const shippingDetails = session.collected_information?.shipping_details;
      const shippingAddress = shippingDetails?.address;
      let orderNumber: string | null = null;

      if (session.amount_total != null) {
        try {
          let lineItems: OrderLineItem[] = [];
          try {
            const li = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 });
            lineItems = li.data.map((item) => ({
              description: item.description ?? "Item",
              quantity: item.quantity ?? 1,
              amountTotal: (item.amount_total ?? 0) / 100,
            }));
          } catch (err) {
            console.error("Could not load line items for", session.id, err);
          }

          const orderId = await upsertOrder({
            stripeSessionId: session.id,
            orderType: isSubscription ? "subscription" : "one_time",
            email: session.customer_details?.email ?? null,
            customerName: session.customer_details?.name ?? null,
            phone: session.customer_details?.phone ?? null,
            amountTotal: session.amount_total / 100,
            currency: session.currency ?? "usd",
            paymentStatus: session.payment_status,
            shippingName: shippingDetails?.name ?? null,
            addressLine1: shippingAddress?.line1 ?? null,
            addressLine2: shippingAddress?.line2 ?? null,
            city: shippingAddress?.city ?? null,
            state: shippingAddress?.state ?? null,
            postalCode: shippingAddress?.postal_code ?? null,
            country: shippingAddress?.country ?? null,
            lineItems,
            createdAt: new Date(session.created * 1000),
          });
          orderNumber = formatOrderNumber(orderId);
        } catch (err) {
          console.error("Failed to save order to database:", err);
        }
      }

      const ghlPayload = {
        email: session.customer_details?.email || null,
        first_name: session.customer_details?.name?.split(" ")[0] || null,
        last_name: session.customer_details?.name?.split(" ").slice(1).join(" ") || null,
        order_id: orderNumber ?? session.id,
        stripe_session_id: session.id,
        amount_total: session.amount_total ? (session.amount_total / 100).toFixed(2) : null,
        currency: session.currency,
        payment_status: session.payment_status,
        shipping_name: shippingDetails?.name || null,
        shipping_address_line1: shippingAddress?.line1 || null,
        shipping_address_line2: shippingAddress?.line2 || null,
        shipping_address_city: shippingAddress?.city || null,
        shipping_address_state: shippingAddress?.state || null,
        shipping_address_postal_code: shippingAddress?.postal_code || null,
        shipping_address_country: shippingAddress?.country || null,
      };

      await sendToGHL(
        isSubscription ? "subscriber_welcome" : "order_confirmation",
        ghlPayload
      );

      if (session.amount_total != null) {
        const meta = isSubscription
          ? session.subscription
            ? (await stripe.subscriptions.retrieve(session.subscription as string)).metadata
            : {}
          : session.metadata ?? {};

        await sendPurchaseToMetaCapi({
          eventId: session.id,
          value: session.amount_total / 100,
          currency: session.currency || "usd",
          email: session.customer_details?.email,
          firstName: session.customer_details?.name?.split(" ")[0],
          lastName: session.customer_details?.name?.split(" ").slice(1).join(" "),
          phone: session.customer_details?.phone,
          city: shippingAddress?.city,
          state: shippingAddress?.state,
          zip: shippingAddress?.postal_code,
          country: shippingAddress?.country,
          fbp: (meta as Record<string, string>)?.fbp,
          fbc: (meta as Record<string, string>)?.fbc,
          clientIpAddress: (meta as Record<string, string>)?.client_ip,
          clientUserAgent: (meta as Record<string, string>)?.client_ua,
          externalId:
            (typeof session.customer === "string"
              ? session.customer
              : session.customer?.id) ?? session.customer_details?.email,
          eventSourceUrl: `${SITE_URL}/success`,
          testEventCode: process.env.META_CAPI_TEST_EVENT_CODE,
        });
      }

      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;

      // Only track renewals, not the first invoice (covered by checkout.session.completed).
      if (invoice.billing_reason !== "subscription_cycle") break;

      console.log(`=== RENEWAL: invoice ${invoice.id}, $${((invoice.amount_paid ?? 0) / 100).toFixed(2)} ===`);

      try {
        const customer = invoice.customer
          ? await stripe.customers.retrieve(invoice.customer as string)
          : null;
        const email =
          invoice.customer_email ??
          (customer && !("deleted" in customer) ? customer.email : null);

        await upsertRenewalOrder({
          stripeInvoiceId: invoice.id,
          email: email ?? null,
          customerName:
            customer && !("deleted" in customer) ? customer.name : null,
          amountTotal: (invoice.amount_paid ?? 0) / 100,
          currency: invoice.currency ?? "usd",
          lineItems:
            invoice.lines?.data.map((li) => ({
              description: li.description ?? "Subscription renewal",
              quantity: li.quantity ?? 1,
              amountTotal: (li.amount ?? 0) / 100,
            })) ?? [],
          createdAt: invoice.created ? new Date(invoice.created * 1000) : undefined,
        });

        await sendToGHL("renewal", {
          email,
          invoice_id: invoice.id,
          amount_total: ((invoice.amount_paid ?? 0) / 100).toFixed(2),
          currency: invoice.currency,
        });
      } catch (err) {
        console.error("Failed to process renewal invoice:", err);
      }

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.error(`=== PAYMENT FAILED: invoice ${invoice.id} ===`);

      const failedName = invoice.customer_name;
      await sendToGHL("payment_failed", {
        email: invoice.customer_email,
        first_name: failedName?.split(" ")[0] || null,
        last_name: failedName?.split(" ").slice(1).join(" ") || null,
        invoice_id: invoice.id,
        amount_due: ((invoice.amount_due ?? 0) / 100).toFixed(2),
        currency: invoice.currency,
        attempt_count: invoice.attempt_count,
        // The dunning email's only CTA. Points at the portal lookup page
        // rather than a generated Stripe session URL: Stripe retries a failed
        // payment over roughly two weeks, and a session link would expire long
        // before the customer opens the last of those emails.
        billing_portal_url: `${SITE_URL}/manage`,
      });

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const previousAttributes = (event.data as any).previous_attributes;

      // Stripe's customer portal schedules a cancellation either by flipping
      // cancel_at_period_end or by setting a cancel_at timestamp, depending on
      // how the portal is configured. Watching only the boolean misses every
      // cancellation made the other way.
      const scheduledToCancel =
        subscription.cancel_at_period_end || subscription.cancel_at != null;
      const justScheduled =
        previousAttributes?.cancel_at_period_end !== undefined ||
        previousAttributes?.cancel_at !== undefined;

      if (justScheduled && scheduledToCancel) {
        console.log(`=== CANCELLATION PENDING: sub ${subscription.id} ===`);
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );
        const cancelName = !("deleted" in customer) ? customer.name : null;
        await sendToGHL("cancellation_pending", {
          email: !("deleted" in customer) ? customer.email : null,
          first_name: cancelName?.split(" ")[0] || null,
          last_name: cancelName?.split(" ").slice(1).join(" ") || null,
          subscription_id: subscription.id,
          // Rendered straight into customer-facing email copy, so send a
          // readable date rather than an ISO timestamp.
          cancel_at: subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000).toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }
              )
            : null,
        });
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`=== SUBSCRIPTION ENDED: sub ${subscription.id} ===`);

      const customer = await stripe.customers.retrieve(
        subscription.customer as string
      );
      const endedName = !("deleted" in customer) ? customer.name : null;
      await sendToGHL("subscription_ended", {
        email: !("deleted" in customer) ? customer.email : null,
        first_name: endedName?.split(" ")[0] || null,
        last_name: endedName?.split(" ").slice(1).join(" ") || null,
        subscription_id: subscription.id,
      });

      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
