import { NextResponse } from "next/server";

// Forwards active-cart snapshots to GoHighLevel so a workflow can trigger an
// abandoned-cart email after a delay. Set GHL_CART_ABANDONMENT_WEBHOOK_URL to
// the inbound webhook URL from that workflow's trigger step.
type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const webhookUrl = process.env.GHL_CART_ABANDONMENT_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ skipped: true });
    }

    const { email, phone, smsConsent, cartItems, totalPrice } = (await req.json()) as {
      email?: string;
      phone?: string;
      smsConsent?: boolean;
      cartItems?: CartItem[];
      totalPrice?: number;
    };

    if (!email || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Missing email or cart items" },
        { status: 400 }
      );
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        phone: phone || null,
        sms_consent: Boolean(smsConsent),
        cart_items: cartItems
          .map((item) => `${item.name} x${item.quantity}`)
          .join(", "),
        cart_total: (totalPrice ?? 0).toFixed(2),
        cart_updated_at: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Failed to forward cart activity:", err);
    return NextResponse.json(
      { error: "Failed to forward cart activity" },
      { status: 500 }
    );
  }
}
