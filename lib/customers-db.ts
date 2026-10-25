import { neon } from "@neondatabase/serverless";

/**
 * Customer accounts and the referral program.
 *
 * Schema is created here with additive `IF NOT EXISTS` statements, matching
 * lib/orders-db.ts — there is no migration tool in this project.
 *
 * Orders are linked to customers by email rather than a foreign key. Orders
 * are created by the Stripe webhook, which knows the email on the payment
 * and nothing about accounts, and people order before registering. Matching
 * on lower(email) means an account picks up the orders that already exist
 * for that address. The tradeoff is that it trusts the email on the payment,
 * which is why the account page shows orders rather than letting anyone act
 * on them.
 */

function getSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL (or POSTGRES_URL) in environment");
  }
  return neon(connectionString);
}

export type CustomerStatus = "pending" | "approved" | "rejected";
export type ReferralStatus = "none" | "pending" | "approved" | "rejected";

/** 20%, in basis points. Stored per referral so a rate can be negotiated. */
export const DEFAULT_REFERRAL_RATE_BPS = 2000;

export interface Customer {
  id: number;
  email: string;
  name: string | null;
  organization: string | null;
  role: string | null;
  status: CustomerStatus;
  createdAt: string;
}

export interface Referral {
  id: number;
  customerId: number;
  code: string | null;
  status: ReferralStatus;
  rateBps: number;
  audience: string | null;
  appliedAt: string | null;
  approvedAt: string | null;
}

let tablesReady = false;

async function ensureTables() {
  if (tablesReady) return;
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      organization TEXT,
      role TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  // Case-insensitive uniqueness: addresses are not case sensitive in
  // practice, and two accounts differing only in case would silently split
  // one person's order history.
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS customers_email_key ON customers (lower(email))`;

  await sql`
    CREATE TABLE IF NOT EXISTS referrals (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      code TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      rate_bps INTEGER NOT NULL DEFAULT ${DEFAULT_REFERRAL_RATE_BPS},
      audience TEXT,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      approved_at TIMESTAMPTZ
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS referrals_customer_key ON referrals (customer_id)`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS referrals_code_key ON referrals (upper(code))`;

  // Attribution lives on the order so commission can be recomputed from the
  // order record alone, rather than from a running total that can drift.
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS referral_code TEXT`;
  await sql`CREATE INDEX IF NOT EXISTS orders_referral_code_idx ON orders (upper(referral_code))`;

  tablesReady = true;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapCustomer(row: any): Customer {
  return {
    id: Number(row.id),
    email: row.email,
    name: row.name ?? null,
    organization: row.organization ?? null,
    role: row.role ?? null,
    status: (row.status as CustomerStatus) ?? "pending",
    createdAt: String(row.created_at),
  };
}

function mapReferral(row: any): Referral {
  return {
    id: Number(row.id),
    customerId: Number(row.customer_id),
    code: row.code ?? null,
    status: (row.status as ReferralStatus) ?? "pending",
    rateBps: Number(row.rate_bps),
    audience: row.audience ?? null,
    appliedAt: row.applied_at ? String(row.applied_at) : null,
    approvedAt: row.approved_at ? String(row.approved_at) : null,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function createCustomer(input: {
  email: string;
  passwordHash: string;
  name?: string;
  organization?: string;
  role?: string;
}): Promise<Customer | null> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO customers (email, password_hash, name, organization, role)
    VALUES (${input.email.trim()}, ${input.passwordHash},
            ${input.name ?? null}, ${input.organization ?? null}, ${input.role ?? null})
    ON CONFLICT (lower(email)) DO NOTHING
    RETURNING *
  `;
  return rows[0] ? mapCustomer(rows[0]) : null;
}

export async function getCustomerByEmail(
  email: string
): Promise<(Customer & { passwordHash: string }) | null> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM customers WHERE lower(email) = lower(${email.trim()}) LIMIT 1
  `;
  if (!rows[0]) return null;
  return { ...mapCustomer(rows[0]), passwordHash: rows[0].password_hash };
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`SELECT * FROM customers WHERE id = ${id} LIMIT 1`;
  return rows[0] ? mapCustomer(rows[0]) : null;
}

export async function listCustomers(): Promise<Customer[]> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`SELECT * FROM customers ORDER BY created_at DESC LIMIT 500`;
  return rows.map(mapCustomer);
}

export async function setCustomerStatus(
  id: number,
  status: CustomerStatus
): Promise<void> {
  await ensureTables();
  const sql = getSql();
  await sql`UPDATE customers SET status = ${status}, updated_at = now() WHERE id = ${id}`;
}

export async function getReferralForCustomer(
  customerId: number
): Promise<Referral | null> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`SELECT * FROM referrals WHERE customer_id = ${customerId} LIMIT 1`;
  return rows[0] ? mapReferral(rows[0]) : null;
}

export async function applyForReferral(
  customerId: number,
  audience: string
): Promise<Referral | null> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO referrals (customer_id, audience)
    VALUES (${customerId}, ${audience})
    ON CONFLICT (customer_id) DO NOTHING
    RETURNING *
  `;
  return rows[0] ? mapReferral(rows[0]) : null;
}

export async function listReferrals(): Promise<(Referral & { email: string })[]> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT r.*, c.email FROM referrals r
    JOIN customers c ON c.id = r.customer_id
    ORDER BY r.applied_at DESC LIMIT 500
  `;
  return rows.map((row) => ({ ...mapReferral(row), email: row.email }));
}

export async function approveReferral(
  referralId: number,
  code: string
): Promise<void> {
  await ensureTables();
  const sql = getSql();
  await sql`
    UPDATE referrals
    SET status = 'approved', code = ${code.trim().toUpperCase()}, approved_at = now()
    WHERE id = ${referralId}
  `;
}

export async function rejectReferral(referralId: number): Promise<void> {
  await ensureTables();
  const sql = getSql();
  await sql`UPDATE referrals SET status = 'rejected', code = NULL WHERE id = ${referralId}`;
}

export interface ReferralEarnings {
  orderCount: number;
  referredTotalCents: number;
  commissionCents: number;
}

/**
 * Commission is computed from the attributed orders every time rather than
 * kept as a running balance. A stored total drifts the moment an order is
 * refunded; a derived one cannot.
 *
 * Refunded and cancelled orders are excluded for the same reason — commission
 * is owed on revenue kept, not revenue booked.
 */
export async function getReferralEarnings(
  code: string,
  rateBps: number
): Promise<ReferralEarnings> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT COUNT(*)::int AS order_count,
           COALESCE(SUM(amount_total), 0)::float AS total
    FROM orders
    WHERE upper(referral_code) = upper(${code})
      AND status NOT IN ('refunded', 'cancelled')
  `;
  const orderCount = Number(rows[0]?.order_count ?? 0);
  const referredTotalCents = Math.round(Number(rows[0]?.total ?? 0) * 100);
  return {
    orderCount,
    referredTotalCents,
    commissionCents: Math.round((referredTotalCents * rateBps) / 10_000),
  };
}

export interface CustomerOrder {
  id: number;
  createdAt: string;
  amountTotal: number;
  currency: string;
  status: string;
  carrier: string | null;
  trackingNumber: string | null;
  lineItems: { description: string; quantity: number }[];
}

/**
 * Orders for an account, matched on the email the payment carried.
 *
 * Read-only on purpose. The match is as trustworthy as the email on a
 * payment, which is enough to show someone their own history but not enough
 * to let them act on an order — cancellations and address changes stay with
 * support, where a person can check.
 */
export async function getOrdersForEmail(email: string): Promise<CustomerOrder[]> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT id, created_at, amount_total, currency, status, carrier,
           tracking_number, line_items
    FROM orders
    WHERE lower(email) = lower(${email.trim()})
    ORDER BY created_at DESC
    LIMIT 100
  `;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return rows.map((row: any) => ({
    id: Number(row.id),
    createdAt: String(row.created_at),
    amountTotal: Number(row.amount_total),
    currency: row.currency ?? "usd",
    status: row.status ?? "unfulfilled",
    carrier: row.carrier ?? null,
    trackingNumber: row.tracking_number ?? null,
    lineItems: Array.isArray(row.line_items)
      ? row.line_items.map((item: any) => ({
          description: String(item?.description ?? "Item"),
          quantity: Number(item?.quantity ?? 1),
        }))
      : [],
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/** Resolves a referral by code, only when it is approved. */
export async function getApprovedReferralByCode(
  code: string
): Promise<Referral | null> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM referrals
    WHERE upper(code) = upper(${code.trim()}) AND status = 'approved'
    LIMIT 1
  `;
  return rows[0] ? mapReferral(rows[0]) : null;
}
