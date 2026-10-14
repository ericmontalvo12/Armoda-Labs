import { NextRequest, NextResponse } from "next/server";
import {
  getOrderById,
  markTrackingEmailSent,
  saveTracking,
  formatOrderNumber,
} from "@/lib/orders-db";
import { getCarrier, normaliseTracking } from "@/lib/shipping";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
    }

    const body = (await req.json()) as {
      carrier?: string;
      trackingNumber?: string;
      resend?: boolean;
    };

    const carrier = getCarrier(String(body.carrier ?? ""));
    if (!carrier) {
      return NextResponse.json({ error: "Select a carrier." }, { status: 400 });
    }

    const trackingNumber = normaliseTracking(String(body.trackingNumber ?? ""));
    if (!trackingNumber) {
      return NextResponse.json({ error: "Enter a tracking number." }, { status: 400 });
    }
    if (!carrier.looksValid(trackingNumber)) {
      return NextResponse.json(
        {
          error: `That doesn't look like a valid ${carrier.label} tracking number. Double-check it, or use "Other / manual".`,
        },
        { status: 400 }
      );
    }

    const existing = await getOrderById(id);
    if (!existing) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Guard against a double-click or a refresh emailing the customer twice.
    if (existing.trackingEmailSentAt && !body.resend) {
      return NextResponse.json(
        {
          error: "A tracking email was already sent for this order.",
          alreadySent: true,
          sentAt: existing.trackingEmailSentAt,
        },
        { status: 409 }
      );
    }

    if (!existing.email) {
      return NextResponse.json(
        { error: "This order has no email address, so no tracking email can be sent." },
        { status: 400 }
      );
    }

    const order = await saveTracking(id, carrier.id, trackingNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const webhookUrl = process.env.GHL_TRACKING_WEBHOOK_URL;
    if (!webhookUrl) {
      // Tracking is saved either way; be explicit that the email did not go out.
      return NextResponse.json(
        {
          order,
          emailSent: false,
          warning:
            "Tracking saved, but GHL_TRACKING_WEBHOOK_URL is not set so no email was sent.",
        },
        { status: 200 }
      );
    }

    const trackingUrl = carrier.trackingUrl(trackingNumber);
    const firstName = (order.customerName || order.shippingName || "").split(" ")[0] || null;

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: order.email,
        first_name: firstName,
        full_name: order.customerName || order.shippingName || null,
        order_id: formatOrderNumber(order.id),
        stripe_session_id: order.stripeSessionId,
        carrier: carrier.label,
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        amount_total: order.amountTotal.toFixed(2),
        currency: order.currency,
        shipping_name: order.shippingName,
        shipping_address_line1: order.addressLine1,
        shipping_address_line2: order.addressLine2,
        shipping_address_city: order.city,
        shipping_address_state: order.state,
        shipping_address_postal_code: order.postalCode,
        shipping_address_country: order.country,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("GHL tracking webhook failed:", res.status, text.slice(0, 300));
      return NextResponse.json(
        {
          order,
          emailSent: false,
          warning: `Tracking saved, but the email failed to send (HTTP ${res.status}). You can retry with Resend.`,
        },
        { status: 200 }
      );
    }

    await markTrackingEmailSent(id);
    const updated = await getOrderById(id);
    return NextResponse.json({ order: updated, emailSent: true });
  } catch (err) {
    console.error("Fulfil order failed:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
