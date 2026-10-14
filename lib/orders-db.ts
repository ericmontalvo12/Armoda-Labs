import { neon } from "@neondatabase/serverless";

function getSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL (or POSTGRES_URL) in environment");
  }
  return neon(connectionString);
}

export type OrderStatus = "unfulfilled" | "fulfilled" | "refunded" | "cancelled";

export interface OrderLineItem {
  description: string;
  quantity: number;
  amountTotal: number;
}

export type OrderType = "one_time" | "subscription" | "renewal";

export interface Order {
  id: number;
  stripeSessionId: string | null;
  stripeInvoiceId: string | null;
  orderType: OrderType;
  email: string | null;
  customerName: string | null;
  phone: string | null;
  amountTotal: number;
  currency: string;
  paymentStatus: string | null;
  shippingName: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  lineItems: OrderLineItem[];
  status: OrderStatus;
  carrier: string | null;
  trackingNumber: string | null;
  trackingEmailSentAt: string | null;
  createdAt: string;
}

let tableReady = false;

async function ensureTables() {
  if (tableReady) return;
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      stripe_session_id TEXT NOT NULL UNIQUE,
      email TEXT,
      customer_name TEXT,
      phone TEXT,
      amount_total NUMERIC(10,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'usd',
      payment_status TEXT,
      shipping_name TEXT,
      address_line1 TEXT,
      address_line2 TEXT,
      city TEXT,
      state TEXT,
      postal_code TEXT,
      country TEXT,
      line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
      status TEXT NOT NULL DEFAULT 'unfulfilled',
      carrier TEXT,
      tracking_number TEXT,
      tracking_email_sent_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status)`;
  await sql`CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (lower(email))`;

  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_invoice_id TEXT UNIQUE`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT NOT NULL DEFAULT 'one_time'`;
  await sql`ALTER TABLE orders ALTER COLUMN stripe_session_id DROP NOT NULL`;

  // Login throttling has to be shared across serverless instances, so it
  // lives in the database rather than in process memory.
  await sql`
    CREATE TABLE IF NOT EXISTS admin_login_attempts (
      id SERIAL PRIMARY KEY,
      ip TEXT NOT NULL,
      succeeded BOOLEAN NOT NULL,
      attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS admin_login_attempts_idx ON admin_login_attempts (ip, attempted_at DESC)`;
  tableReady = true;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any): Order {
  return {
    id: row.id,
    stripeSessionId: row.stripe_session_id,
    stripeInvoiceId: row.stripe_invoice_id ?? null,
    orderType: row.order_type ?? "one_time",
    email: row.email,
    customerName: row.customer_name,
    phone: row.phone,
    amountTotal: Number(row.amount_total),
    currency: row.currency,
    paymentStatus: row.payment_status,
    shippingName: row.shipping_name,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country,
    lineItems: Array.isArray(row.line_items) ? row.line_items : [],
    status: row.status,
    carrier: row.carrier,
    trackingNumber: row.tracking_number,
    trackingEmailSentAt: row.tracking_email_sent_at,
    createdAt: row.created_at,
  };
}

export interface UpsertOrderInput {
  stripeSessionId: string;
  orderType?: OrderType;
  email?: string | null;
  customerName?: string | null;
  phone?: string | null;
  amountTotal: number;
  currency: string;
  paymentStatus?: string | null;
  shippingName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  lineItems?: OrderLineItem[];
  createdAt?: Date;
}

/**
 * Idempotent on stripe_session_id: Stripe retries webhooks, and the backfill
 * may cover orders the webhook already saved. Fulfilment fields are never
 * overwritten, so a re-delivered webhook can't wipe a tracking number.
 */
// Customer-facing order numbers are derived from the row id, offset so the
// first order doesn't advertise itself as number 1.
const ORDER_NUMBER_OFFSET = 1000;

export function formatOrderNumber(id: number): string {
  return `RMP-${ORDER_NUMBER_OFFSET + id}`;
}

export async function getOrderNumberBySessionId(
  sessionId: string
): Promise<string | null> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT id FROM orders WHERE stripe_session_id = ${sessionId} LIMIT 1
  `;
  return rows.length ? formatOrderNumber(Number(rows[0].id)) : null;
}

export async function upsertOrder(input: UpsertOrderInput): Promise<number> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO orders (
      stripe_session_id, order_type, email, customer_name, phone, amount_total,
      currency, payment_status, shipping_name, address_line1, address_line2,
      city, state, postal_code, country, line_items, created_at
    ) VALUES (
      ${input.stripeSessionId}, ${input.orderType ?? "one_time"},
      ${input.email ?? null}, ${input.customerName ?? null},
      ${input.phone ?? null}, ${input.amountTotal}, ${input.currency},
      ${input.paymentStatus ?? null}, ${input.shippingName ?? null},
      ${input.addressLine1 ?? null}, ${input.addressLine2 ?? null}, ${input.city ?? null},
      ${input.state ?? null}, ${input.postalCode ?? null}, ${input.country ?? null},
      ${JSON.stringify(input.lineItems ?? [])}::jsonb,
      ${(input.createdAt ?? new Date()).toISOString()}
    )
    ON CONFLICT (stripe_session_id) DO UPDATE SET
      email = EXCLUDED.email,
      customer_name = EXCLUDED.customer_name,
      phone = EXCLUDED.phone,
      amount_total = EXCLUDED.amount_total,
      payment_status = EXCLUDED.payment_status,
      shipping_name = EXCLUDED.shipping_name,
      address_line1 = EXCLUDED.address_line1,
      address_line2 = EXCLUDED.address_line2,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      postal_code = EXCLUDED.postal_code,
      country = EXCLUDED.country,
      line_items = EXCLUDED.line_items,
      updated_at = now()
    RETURNING id
  `;
  return Number(rows[0].id);
}

export interface UpsertRenewalInput {
  stripeInvoiceId: string;
  email?: string | null;
  customerName?: string | null;
  amountTotal: number;
  currency: string;
  lineItems?: OrderLineItem[];
  createdAt?: Date;
}

export async function upsertRenewalOrder(input: UpsertRenewalInput): Promise<void> {
  await ensureTables();
  const sql = getSql();
  await sql`
    INSERT INTO orders (
      stripe_invoice_id, order_type, email, customer_name, amount_total,
      currency, payment_status, line_items, created_at
    ) VALUES (
      ${input.stripeInvoiceId}, 'renewal',
      ${input.email ?? null}, ${input.customerName ?? null},
      ${input.amountTotal}, ${input.currency}, 'paid',
      ${JSON.stringify(input.lineItems ?? [])}::jsonb,
      ${(input.createdAt ?? new Date()).toISOString()}
    )
    ON CONFLICT (stripe_invoice_id) DO NOTHING
  `;
}

export async function listOrders(opts: {
  search?: string;
  status?: OrderStatus | "all";
  limit?: number;
  offset?: number;
} = {}): Promise<{ orders: Order[]; total: number }> {
  await ensureTables();
  const sql = getSql();
  const search = opts.search?.trim() ? `%${opts.search.trim().toLowerCase()}%` : null;
  const status = opts.status && opts.status !== "all" ? opts.status : null;
  const limit = Math.min(opts.limit ?? 50, 200);
  const offset = Math.max(opts.offset ?? 0, 0);

  const rows = await sql`
    SELECT * FROM orders
    WHERE (${status}::text IS NULL OR status = ${status})
      AND (${search}::text IS NULL
           OR lower(email) LIKE ${search}
           OR lower(customer_name) LIKE ${search}
           OR lower(shipping_name) LIKE ${search}
           OR lower(stripe_session_id) LIKE ${search}
           OR lower(tracking_number) LIKE ${search})
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countRows = await sql`
    SELECT count(*)::int AS total FROM orders
    WHERE (${status}::text IS NULL OR status = ${status})
      AND (${search}::text IS NULL
           OR lower(email) LIKE ${search}
           OR lower(customer_name) LIKE ${search}
           OR lower(shipping_name) LIKE ${search}
           OR lower(stripe_session_id) LIKE ${search}
           OR lower(tracking_number) LIKE ${search})
  `;

  return {
    orders: rows.map(mapRow),
    total: (countRows[0] as { total: number })?.total ?? 0,
  };
}

export async function getOrderById(id: number): Promise<Order | null> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`SELECT * FROM orders WHERE id = ${id} LIMIT 1`;
  return rows.length ? mapRow(rows[0]) : null;
}

/**
 * Records tracking details. Returns null if the order is missing, and leaves
 * tracking_email_sent_at alone - the caller stamps it only after the email
 * actually goes out.
 */
export async function saveTracking(
  id: number,
  carrier: string,
  trackingNumber: string
): Promise<Order | null> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    UPDATE orders
    SET carrier = ${carrier},
        tracking_number = ${trackingNumber},
        status = 'fulfilled',
        updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows.length ? mapRow(rows[0]) : null;
}

export async function markTrackingEmailSent(id: number): Promise<void> {
  await ensureTables();
  const sql = getSql();
  await sql`UPDATE orders SET tracking_email_sent_at = now(), updated_at = now() WHERE id = ${id}`;
}

export async function setOrderStatus(id: number, status: OrderStatus): Promise<Order | null> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    UPDATE orders SET status = ${status}, updated_at = now() WHERE id = ${id} RETURNING *
  `;
  return rows.length ? mapRow(rows[0]) : null;
}

export async function getOrderStats(): Promise<{
  totalRevenue: number;
  orderCount: number;
  unfulfilled: number;
  last30dRevenue: number;
}> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT
      COALESCE(SUM(amount_total) FILTER (WHERE status <> 'refunded'), 0)::float AS total_revenue,
      COUNT(*)::int AS order_count,
      COUNT(*) FILTER (WHERE status = 'unfulfilled')::int AS unfulfilled,
      COALESCE(SUM(amount_total) FILTER (
        WHERE status <> 'refunded' AND created_at > now() - interval '30 days'
      ), 0)::float AS last30d_revenue
    FROM orders
  `;
  const r = rows[0] as any;
  return {
    totalRevenue: Number(r.total_revenue) || 0,
    orderCount: r.order_count ?? 0,
    unfulfilled: r.unfulfilled ?? 0,
    last30dRevenue: Number(r.last30d_revenue) || 0,
  };
}

/* ---------------------------- login throttling ---------------------------- */

const MAX_FAILURES = 8;
const WINDOW_MINUTES = 15;

export async function isLoginRateLimited(ip: string): Promise<boolean> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT count(*)::int AS failures
    FROM admin_login_attempts
    WHERE ip = ${ip}
      AND succeeded = false
      AND attempted_at > now() - (${WINDOW_MINUTES} || ' minutes')::interval
  `;
  return ((rows[0] as { failures: number })?.failures ?? 0) >= MAX_FAILURES;
}

export async function recordLoginAttempt(ip: string, succeeded: boolean): Promise<void> {
  await ensureTables();
  const sql = getSql();
  await sql`INSERT INTO admin_login_attempts (ip, succeeded) VALUES (${ip}, ${succeeded})`;
  // Keep the table from growing without bound.
  await sql`DELETE FROM admin_login_attempts WHERE attempted_at < now() - interval '1 day'`;
}
