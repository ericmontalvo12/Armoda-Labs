import { neon } from "@neondatabase/serverless";

/**
 * Store credit.
 *
 * /shipping-and-claims commits Armoda to resolving verified problems with
 * store credit, and to never accepting a return. This is what makes that
 * promise real.
 *
 * APPEND-ONLY LEDGER, NO STORED BALANCE. A balance column drifts: a refund,
 * a correction or a double-click leaves it disagreeing with the history that
 * explains it, and you cannot tell which is wrong. The balance here is always
 * SUM(amount_cents), so the number and its explanation cannot diverge. Same
 * reasoning as referral commission in customers-db.ts.
 *
 * CENTS, AS INTEGERS. orders.amount_total is NUMERIC(10,2) in dollars because
 * it mirrors Stripe's view of a payment. Credit is arithmetic we do ourselves,
 * repeatedly, so it is held in integer cents where it cannot pick up a
 * floating-point remainder.
 *
 * KEYED BY EMAIL, like orders. Credit is often issued against an order placed
 * before the customer registered, and has to survive them registering later.
 */

function getSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL (or POSTGRES_URL) in environment");
  }
  return neon(connectionString);
}

/** Why an entry exists. Stored as text; this list is the UI's vocabulary. */
export const CREDIT_REASONS = [
  "damaged_in_transit",
  "not_delivered",
  "wrong_item",
  "shipping_error",
  "goodwill",
  "correction",
  "redeemed",
] as const;

export type CreditReason = (typeof CREDIT_REASONS)[number];

export interface CreditEntry {
  id: number;
  email: string;
  amountCents: number;
  reason: CreditReason | string;
  orderId: number | null;
  note: string | null;
  createdAt: string;
}

// The in-flight promise, not a boolean. A boolean is only set after the DDL
// finishes, so concurrent first callers each see false and each run it. That
// is not hypothetical: /account loads the balance and the history in one
// Promise.all, so a cold start always had two callers here at once.
let tablesReady: Promise<void> | null = null;

function ensureTables(): Promise<void> {
  if (!tablesReady) {
    tablesReady = createTables().catch((err) => {
      // Let the next request retry rather than caching a rejected promise.
      tablesReady = null;
      throw err;
    });
  }
  return tablesReady;
}

async function createTables() {
  const sql = getSql();

  // No parameters anywhere in this DDL: the Neon tag binds every ${} and
  // Postgres rejects parameters in DDL.
  await sql`
    CREATE TABLE IF NOT EXISTS store_credit_entries (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      reason TEXT NOT NULL,
      order_id INTEGER,
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS store_credit_email_idx
      ON store_credit_entries (lower(email))
  `;
  // A zero entry is always a mistake, and would clutter a statement a
  // customer reads. Added only when absent: DROP then ADD leaves a window
  // with no constraint, and two of them racing is what threw on cold start.
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'store_credit_amount_nonzero'
      ) THEN
        ALTER TABLE store_credit_entries
          ADD CONSTRAINT store_credit_amount_nonzero CHECK (amount_cents <> 0);
      END IF;
    END $$
  `;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapEntry(row: any): CreditEntry {
  return {
    id: Number(row.id),
    email: row.email,
    amountCents: Number(row.amount_cents),
    reason: row.reason,
    orderId: row.order_id == null ? null : Number(row.order_id),
    note: row.note ?? null,
    createdAt: String(row.created_at),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Current balance in cents. Always derived, never read from a column. */
export async function getCreditBalanceCents(email: string): Promise<number> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT COALESCE(SUM(amount_cents), 0)::int AS balance
    FROM store_credit_entries
    WHERE lower(email) = lower(${email.trim()})
  `;
  return Number(rows[0]?.balance ?? 0);
}

export async function listCreditEntries(email: string): Promise<CreditEntry[]> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM store_credit_entries
    WHERE lower(email) = lower(${email.trim()})
    ORDER BY created_at DESC, id DESC
    LIMIT 200
  `;
  return rows.map(mapEntry);
}

/** Most recent entries across all customers, for the admin overview. */
export async function listRecentCredit(limit = 50): Promise<CreditEntry[]> {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM store_credit_entries
    ORDER BY created_at DESC, id DESC
    LIMIT ${Math.min(Math.max(limit, 1), 200)}
  `;
  return rows.map(mapEntry);
}

export class InsufficientCreditError extends Error {
  constructor(public balanceCents: number) {
    super("Insufficient store credit");
    this.name = "InsufficientCreditError";
  }
}

/**
 * Appends an entry. Positive issues credit, negative consumes it.
 *
 * The overdraft guard is INSIDE the insert, not a read followed by a write.
 * A read-then-write leaves a window where two deductions each see the same
 * balance and both pass, spending the credit twice. Here the balance is
 * recomputed in the same statement that writes the row, so the database
 * settles it. No rows returned means the guard rejected it.
 */
export async function addCreditEntry(input: {
  email: string;
  amountCents: number;
  reason: CreditReason | string;
  orderId?: number | null;
  note?: string | null;
}): Promise<CreditEntry> {
  await ensureTables();
  const sql = getSql();

  const amount = Math.trunc(input.amountCents);
  if (!Number.isSafeInteger(amount) || amount === 0) {
    throw new Error("Credit amount must be a non-zero whole number of cents");
  }

  const email = input.email.trim();

  const rows = await sql`
    INSERT INTO store_credit_entries (email, amount_cents, reason, order_id, note)
    SELECT ${email}, ${amount}, ${input.reason},
           ${input.orderId ?? null}, ${input.note ?? null}
    WHERE ${amount} >= 0
       OR (
         SELECT COALESCE(SUM(amount_cents), 0)
         FROM store_credit_entries
         WHERE lower(email) = lower(${email})
       ) + ${amount} >= 0
    RETURNING *
  `;

  if (!rows[0]) {
    // The only way the guard rejects is an overdraft, so report the balance.
    throw new InsufficientCreditError(await getCreditBalanceCents(email));
  }
  return mapEntry(rows[0]);
}

export function formatCredit(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
