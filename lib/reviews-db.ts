import { neon } from "@neondatabase/serverless";
import Stripe from "stripe";

function getSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL (or POSTGRES_URL) in environment");
  }
  return neon(connectionString);
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  quote: string;
  createdAt: string;
  /**
   * Whether a photo exists - NOT the photo itself. Photos are stored as base64
   * data URLs, so selecting them here put every photo into both the API
   * response and the server-rendered product page: ~5.5MB per view, which
   * exhausted Neon's transfer allowance and suspended the database. Photos are
   * served one at a time from /api/reviews/[id]/photo, which the CDN can cache.
   */
  hasPhoto: boolean;
  verifiedPurchase: boolean;
}

async function ensureTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      quote TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  // Existing rows predate these columns and were all genuinely verified
  // purchases (the gate was always on before), so default true is accurate.
  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photo_data_url TEXT`;
  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN NOT NULL DEFAULT true`;
}

export async function getReviews(): Promise<Review[]> {
  await ensureTable();
  const sql = getSql();
  // photo_data_url is deliberately not selected - see Review.hasPhoto.
  const rows = (await sql`
    SELECT
      id, name, rating, quote, created_at, verified_purchase,
      photo_data_url IS NOT NULL AS has_photo
    FROM reviews
    ORDER BY created_at DESC
  `) as Array<{
    id: number;
    name: string;
    rating: number;
    quote: string;
    created_at: string;
    has_photo: boolean;
    verified_purchase: boolean;
  }>;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    rating: row.rating,
    quote: row.quote,
    createdAt: row.created_at,
    hasPhoto: row.has_photo,
    verifiedPurchase: row.verified_purchase,
  }));
}

/**
 * Loads one review's photo. Kept separate from getReviews so a page listing
 * reviews transfers kilobytes instead of megabytes.
 */
export async function getReviewPhoto(
  id: number
): Promise<{ contentType: string; body: Buffer } | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT photo_data_url FROM reviews WHERE id = ${id} LIMIT 1
  `) as Array<{ photo_data_url: string | null }>;

  const dataUrl = rows[0]?.photo_data_url;
  if (!dataUrl) return null;

  // [\s\S] rather than the /s flag, which needs an es2018 target.
  const match = /^data:([^;,]+);base64,([\s\S]*)$/.exec(dataUrl);
  if (!match) return null;

  return { contentType: match[1], body: Buffer.from(match[2], "base64") };
}

export async function hasReviewForEmail(email: string): Promise<boolean> {
  await ensureTable();
  const sql = getSql();
  const rows = await sql`SELECT id FROM reviews WHERE email = ${email.toLowerCase()} LIMIT 1`;
  return rows.length > 0;
}

export async function insertReview(params: {
  email: string;
  name: string;
  rating: number;
  quote: string;
  photoDataUrl?: string | null;
  verifiedPurchase: boolean;
}) {
  await ensureTable();
  const sql = getSql();
  await sql`
    INSERT INTO reviews (email, name, rating, quote, photo_data_url, verified_purchase)
    VALUES (
      ${params.email.toLowerCase()},
      ${params.name},
      ${params.rating},
      ${params.quote},
      ${params.photoDataUrl ?? null},
      ${params.verifiedPurchase}
    )
  `;
}

// A review is only ever published if this returns true - the email must
// match a real, completed Checkout Session. Stripe's Search API doesn't
// support searching charges by receipt_email, so this lists sessions and
// matches the email in code instead (same field the order-confirmation
// webhook already reads from session.customer_details.email).
export async function verifyPurchase(email: string): Promise<boolean> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return false;

  const stripe = new Stripe(secretKey);
  const normalizedEmail = email.trim().toLowerCase();

  let startingAfter: string | undefined;
  for (let page = 0; page < 20; page++) {
    const sessions: Stripe.ApiList<Stripe.Checkout.Session> = await stripe.checkout.sessions.list({
      limit: 100,
      starting_after: startingAfter,
    });

    const match = sessions.data.find(
      (session) =>
        session.payment_status === "paid" &&
        session.customer_details?.email?.toLowerCase() === normalizedEmail
    );
    if (match) return true;

    if (!sessions.has_more || sessions.data.length === 0) break;
    startingAfter = sessions.data[sessions.data.length - 1].id;
  }

  return false;
}
