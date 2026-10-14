import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const promoCodes = await stripe.promotionCodes.list({
    code,
    active: true,
    limit: 1,
    expand: ["data.promotion.coupon"],
  });

  if (promoCodes.data.length === 0) {
    return NextResponse.json({ error: "Invalid or expired discount code." }, { status: 400 });
  }

  const promo = promoCodes.data[0];
  const rawCoupon = promo.promotion.coupon;

  // If coupon is a string ID (not expanded), fetch the full coupon object
  let coupon: Stripe.Coupon;
  if (typeof rawCoupon === "string") {
    coupon = await stripe.coupons.retrieve(rawCoupon);
  } else if (rawCoupon && typeof rawCoupon === "object") {
    coupon = rawCoupon;
  } else {
    return NextResponse.json({ error: "Could not resolve coupon." }, { status: 400 });
  }

  return NextResponse.json({
    promotionCodeId: promo.id,
    percentOff: coupon.percent_off ?? null,
    amountOff: coupon.amount_off ?? null,
  });
}
