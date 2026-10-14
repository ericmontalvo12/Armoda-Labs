import crypto from "crypto";
import { FB_PIXEL_ID } from "./fbpixel";

const GRAPH_VERSION = "v21.0";

// Meta requires PII to be SHA-256 hashed, lowercased and trimmed first.
function hash(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

function hashPhone(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  // Digits only - Meta matches on the normalized international number.
  const digits = value.replace(/\D/g, "");
  if (!digits) return undefined;
  return crypto.createHash("sha256").update(digits).digest("hex");
}

export interface PurchaseEventInput {
  /** Stripe checkout session id - doubles as the dedup key against the browser event. */
  eventId: string;
  value: number;
  currency: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  /** Meta browser cookies captured at checkout; the strongest ad-attribution signal. */
  fbp?: string | null;
  fbc?: string | null;
  /**
   * The customer's IP and user agent, captured when the checkout session was
   * created. They cannot be read in the webhook - that request comes from
   * Stripe's servers, so the headers there describe Stripe, not the buyer.
   * Meta weights both heavily for attribution.
   */
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  /** Stable per-customer id (Stripe customer id, else email). Hashed before sending. */
  externalId?: string | null;
  eventSourceUrl?: string | null;
  /** Set only while verifying in Events Manager -> Test Events. */
  testEventCode?: string | null;
}

/**
 * Sends a Purchase event to the Meta Conversions API.
 *
 * The browser also fires Purchase from /success with the same event id, but
 * that only happens if the customer's browser actually loads the return_url.
 * This runs from the Stripe webhook, which fires for every completed order
 * regardless of the browser, so it is the reliable path. Meta dedupes the two
 * by event_id and keeps whichever arrives first.
 *
 * Never throws - a tracking failure must not break order processing.
 */
export async function sendPurchaseToMetaCapi(
  input: PurchaseEventInput
): Promise<{ ok: boolean; reason?: string }> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    return { ok: false, reason: "META_CAPI_ACCESS_TOKEN not set" };
  }

  const userData: Record<string, unknown> = {};
  const em = hash(input.email);
  const fn = hash(input.firstName);
  const ln = hash(input.lastName);
  const ph = hashPhone(input.phone);
  const ct = hash(input.city);
  const st = hash(input.state);
  const zp = hash(input.zip);
  const country = hash(input.country);

  // Meta expects these as arrays.
  if (em) userData.em = [em];
  if (fn) userData.fn = [fn];
  if (ln) userData.ln = [ln];
  if (ph) userData.ph = [ph];
  if (ct) userData.ct = [ct];
  if (st) userData.st = [st];
  if (zp) userData.zp = [zp];
  if (country) userData.country = [country];
  // Cookies are NOT hashed.
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  // IP and user agent are sent in the clear - Meta matches on the raw values.
  if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;

  // external_id is hashed like the other identifiers.
  const externalId = hash(input.externalId);
  if (externalId) userData.external_id = [externalId];

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
        user_data: userData,
        custom_data: {
          value: input.value,
          currency: input.currency.toUpperCase(),
        },
      },
    ],
    ...(input.testEventCode ? { test_event_code: input.testEventCode } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${FB_PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("Meta CAPI Purchase failed:", res.status, body.slice(0, 500));
      return { ok: false, reason: `HTTP ${res.status}` };
    }

    console.log("Meta CAPI Purchase sent:", input.eventId, input.value, input.currency);
    return { ok: true };
  } catch (err) {
    console.error("Meta CAPI Purchase error:", err);
    return { ok: false, reason: "network error" };
  }
}
