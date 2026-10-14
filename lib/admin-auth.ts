/**
 * Admin session tokens.
 *
 * Uses Web Crypto rather than node:crypto so the same code runs in Edge
 * middleware and in Node route handlers.
 *
 * Token format: `<expiryMs>.<hmacHex>` - the signature covers the expiry, so
 * a tampered expiry fails verification. There is no user identity in the
 * token because this is a single shared password; if per-user accounts are
 * added later, only this file and the login route need to change.
 */

const encoder = new TextEncoder();

export const ADMIN_COOKIE = "rmp_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set and at least 32 characters"
    );
  }
  return secret;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
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

export async function createSessionToken(): Promise<string> {
  const expiry = Date.now() + SESSION_TTL_MS;
  const key = await importKey(getSecret());
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(String(expiry))
  );
  return `${expiry}.${toHex(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const [expiryPart, signaturePart] = token.split(".");
  if (!expiryPart || !signaturePart) return false;

  const expiry = Number(expiryPart);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  const signature = fromHex(signaturePart);
  if (!signature) return false;

  try {
    const key = await importKey(getSecret());
    // subtle.verify is constant-time, so this can't leak the signature.
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

/** Constant-time string compare, so password checks can't be timed. */
export async function safeEquals(a: string, b: string): Promise<boolean> {
  // Hashing first equalises length, so length alone reveals nothing.
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
