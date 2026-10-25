/**
 * Site-wide pre-launch gate.
 *
 * Replaces components/PasswordGate.tsx, which gated on a localStorage flag -
 * bypassable from devtools in one line, and no protection for API routes at
 * all. This is enforced in middleware before any page renders.
 *
 * The signing key is derived from SITE_PASSWORD itself, so changing the
 * password invalidates every existing cookie. Web Crypto only, because this
 * runs in Edge middleware.
 */

const encoder = new TextEncoder();

export const SITE_GATE_COOKIE = "armoda_gate";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const SITE_GATE_MAX_AGE_SECONDS = TTL_MS / 1000;

/** The gate is only active when a password is configured. */
export function sitePassword(): string | undefined {
  const value = process.env.SITE_PASSWORD;
  return value && value.length > 0 ? value : undefined;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(`site-gate:${secret}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0 || /[^0-9a-f]/i.test(hex)) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export async function createGateToken(secret: string): Promise<string> {
  const expiry = Date.now() + TTL_MS;
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(String(expiry))
  );
  return `${expiry}.${toHex(signature)}`;
}

export async function verifyGateToken(
  token: string | undefined | null,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const [expiryPart, signaturePart] = token.split(".");
  if (!expiryPart || !signaturePart) return false;

  const expiry = Number(expiryPart);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  const signature = fromHex(signaturePart);
  if (!signature) return false;

  try {
    const key = await importKey(secret);
    return await crypto.subtle.verify(
      "HMAC",
      key,
      signature as unknown as BufferSource,
      encoder.encode(expiryPart)
    );
  } catch {
    return false;
  }
}
