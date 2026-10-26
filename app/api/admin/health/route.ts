import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

/**
 * Configuration check for a deployed environment.
 *
 * Exists because the routes that depend on configuration return deliberately
 * vague errors - "Could not create the account." is the same message whether
 * the database is unreachable or the insert failed - which leaves the only
 * real diagnosis in the server log.
 *
 * Behind the admin gate (middleware matches /api/admin/:path*), because even
 * knowing WHICH variables are unset tells an attacker where to push. It
 * reports presence as a boolean and never a value, so the response is safe
 * to paste into a chat even though reaching it requires the admin password.
 */

const REQUIRED = [
  "ADMIN_SESSION_SECRET",
  "CUSTOMER_SESSION_SECRET",
  "ADMIN_PASSWORD",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_SITE_URL",
] as const;

const OPTIONAL = [
  "SITE_PASSWORD",
  "STRIPE_SUBSCRIPTION_PRICE_ID",
  "GHL_ORDER_WEBHOOK_URL",
] as const;

// Must stay unset: Meta prohibits peptides. See decision 2 in CLAUDE.md.
const MUST_BE_UNSET = [
  "NEXT_PUBLIC_FB_PIXEL_ID",
  "META_CAPI_ACCESS_TOKEN",
] as const;

const EXPECTED_TABLES = ["orders", "reviews", "customers", "referrals"];

function present(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.length > 0;
}

/** The two session secrets are enforced at 32 chars, so report that too. */
function longEnough(name: string): boolean | null {
  const value = process.env[name];
  if (!value) return null;
  return value.length >= 32;
}

export async function GET() {
  const env = {
    required: Object.fromEntries(REQUIRED.map((k) => [k, present(k)])),
    optional: Object.fromEntries(OPTIONAL.map((k) => [k, present(k)])),
    mustBeUnset: Object.fromEntries(MUST_BE_UNSET.map((k) => [k, present(k)])),
    secretsLongEnough: {
      ADMIN_SESSION_SECRET: longEnough("ADMIN_SESSION_SECRET"),
      CUSTOMER_SESSION_SECRET: longEnough("CUSTOMER_SESSION_SECRET"),
    },
    nodeEnv: process.env.NODE_ENV ?? null,
  };

  const connectionString =
    process.env.DATABASE_URL || process.env.POSTGRES_URL;

  const database: Record<string, unknown> = {
    variableSet: Boolean(connectionString),
    whichVariable: process.env.DATABASE_URL
      ? "DATABASE_URL"
      : process.env.POSTGRES_URL
        ? "POSTGRES_URL"
        : null,
    reachable: false,
    tables: null,
    missingTables: null,
    error: null,
  };

  if (connectionString) {
    try {
      const sql = neon(connectionString);
      // Read-only on purpose: this must never create the tables it reports
      // on, or it would mask the very problem it is meant to surface.
      const rows = await sql`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      const tables = rows.map((r) => String(r.table_name));
      database.reachable = true;
      database.tables = tables;
      database.missingTables = EXPECTED_TABLES.filter(
        (t) => !tables.includes(t)
      );
    } catch (err) {
      // Safe to return: a connection failure message names the host, not
      // the password, and this route already requires the admin session.
      database.error = err instanceof Error ? err.message : String(err);
    }
  }

  const ok =
    database.reachable &&
    Array.isArray(database.missingTables) &&
    REQUIRED.every((k) => present(k)) &&
    MUST_BE_UNSET.every((k) => !present(k));

  return NextResponse.json({ ok, env, database }, { status: ok ? 200 : 503 });
}
