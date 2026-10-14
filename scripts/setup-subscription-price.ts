/**
 * One-time setup: creates the $39.99/month recurring Price in Stripe
 * and audits the WELCOME10 coupon duration.
 *
 * Run: npx tsx scripts/setup-subscription-price.ts
 *
 * Requires STRIPE_SECRET_KEY in your environment (or .env.local).
 * The script is idempotent — it checks for an existing price first.
 */
import Stripe from "stripe";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.error("Set STRIPE_SECRET_KEY in .env.local or your environment.");
  process.exit(1);
}

const stripe = new Stripe(secretKey);
const TARGET_AMOUNT = 3999; // $39.99 in cents
const TARGET_INTERVAL = "month";

async function findExistingPrice(): Promise<Stripe.Price | null> {
  const prices = await stripe.prices.list({
    active: true,
    type: "recurring",
    limit: 100,
    expand: ["data.product"],
  });

  return (
    prices.data.find(
      (p) =>
        p.unit_amount === TARGET_AMOUNT &&
        p.recurring?.interval === TARGET_INTERVAL &&
        p.recurring?.interval_count === 1 &&
        p.currency === "usd"
    ) ?? null
  );
}

async function findOrCreateProduct(): Promise<string> {
  const products = await stripe.products.list({ active: true, limit: 100 });
  const existing = products.data.find((p) =>
    p.name.toLowerCase().includes("peak performance")
  );
  if (existing) {
    console.log(`Found existing product: ${existing.id} ("${existing.name}")`);
    return existing.id;
  }

  const product = await stripe.products.create({
    name: "Peak Performance — Monthly Subscription",
    description:
      "Research-aligned testosterone support. 30 servings, shipped monthly.",
  });
  console.log(`Created product: ${product.id}`);
  return product.id;
}

async function auditWelcome10Coupon(): Promise<void> {
  console.log("\n--- WELCOME10 Coupon Audit ---");
  try {
    const promos = await stripe.promotionCodes.list({
      code: "WELCOME10",
      active: true,
      limit: 1,
      expand: ["data.coupon"],
    });

    if (promos.data.length === 0) {
      console.log("No active WELCOME10 promotion code found.");
      return;
    }

    const promo = promos.data[0];
    const coupon =
      typeof promo.coupon === "string"
        ? await stripe.coupons.retrieve(promo.coupon)
        : promo.coupon;

    console.log(`Coupon ID: ${coupon.id}`);
    console.log(`Percent off: ${coupon.percent_off}%`);
    console.log(`Duration: ${coupon.duration}`);
    if (coupon.duration === "repeating") {
      console.log(`Duration in months: ${coupon.duration_in_months}`);
    }

    if (coupon.duration !== "once") {
      console.log(
        `\n⚠️  WARNING: Duration is "${coupon.duration}" — subscribers from the ` +
          `exit popup will pay a discounted rate beyond the first month.\n` +
          `Fix: update the coupon duration to "once" in the Stripe dashboard,\n` +
          `or run:\n` +
          `  stripe coupons update ${coupon.id} --duration=once\n` +
          `(Note: Stripe may require creating a new coupon if duration can't be ` +
          `updated on an existing one.)`
      );
    } else {
      console.log("✓ Duration is 'once' — safe for subscriptions.");
    }
  } catch (err) {
    console.error("Could not audit WELCOME10:", err);
  }
}

async function main() {
  console.log("--- Subscription Price Setup ---\n");

  const existing = await findExistingPrice();
  if (existing) {
    console.log(`Found existing $39.99/month price: ${existing.id}`);
    console.log(
      `\nAdd to .env.local:\n  STRIPE_SUBSCRIPTION_PRICE_ID=${existing.id}`
    );
    await auditWelcome10Coupon();
    return;
  }

  const productId = await findOrCreateProduct();

  const price = await stripe.prices.create({
    product: productId,
    unit_amount: TARGET_AMOUNT,
    currency: "usd",
    recurring: { interval: TARGET_INTERVAL, interval_count: 1 },
    lookup_key: "peak_performance_monthly",
  });

  console.log(`Created price: ${price.id}`);
  console.log(
    `\nAdd to .env.local and Vercel:\n  STRIPE_SUBSCRIPTION_PRICE_ID=${price.id}`
  );

  await auditWelcome10Coupon();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
