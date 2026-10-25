/**
 * Customer password hashing and session tokens.
 *
 * Uses Web Crypto throughout, like lib/admin-auth.ts, so the same code runs
 * in Edge middleware and in Node route handlers. That rules out scrypt and
 * argon2, which are node-only, so passwords use PBKDF2-SHA256 at a high
 * iteration count — slower per guess is the whole point.
 *
 * The session token carries the customer id, unlike the admin token, because
 * there are many customers rather than one shared password. The signature
 * covers both the id and the expiry, so neither can be edited: swapping the
 * id to another customer's invalidates the signature.
 *
 * A token proves identity, not entitlement. Approval status is read from the
 * database on every request rather than baked into the token, so revoking an
 * account takes effect immediately instead of whenever the cookie expires.
 */

const encoder = new TextEncoder();

export const CUSTOMER_COOKIE = "armoda_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const CUSTOMER_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

const PBKDF2_ITERATIONS = 210_000;

function getSecret(): string {
  const secret = process.env.CUSTOMER_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "CUSTOMER_SESSION_SECRET must be set and at least 32 characters"
    );
  }
  return secret;
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

async function derive(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as BufferSource,
      iterations,
      hash: "SHA-256",
    },
    key,
    256
  );
  return toHex(bits);
}

/** Returns `pbkdf2$<iterations>$<saltHex>$<hashHex>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt.buffer)}$${hash}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [scheme, iterPart, saltHex, expected] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterPart || !saltHex || !expected) return false;

  const iterations = Number(iterPart);
  if (!Number.isFinite(iterations) || iterations < 1) return false;

  const salt = fromHex(saltHex);
  if (!salt) return false;

  const actual = await derive(password, salt, iterations);

  // Constant-time compare — a length check or an early return would leak
  // how much of the hash matched.
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) {
    diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
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

export async function createCustomerToken(customerId: number): Promise<string> {
  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = `${customerId}.${expiry}`;
  const key = await importKey(getSecret());
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  return `${payload}.${toHex(signature)}`;
}

/** Resolves the customer id a valid token names, or null. */
export async function readCustomerToken(
  token: string | undefined | null
): Promise<number | null> {
  if (!token) return null;
  const [idPart, expiryPart, signaturePart] = token.split(".");
  if (!idPart || !expiryPart || !signaturePart) return null;

  const id = Number(idPart);
  const expiry = Number(expiryPart);
  if (!Number.isInteger(id) || id < 1) return null;
  if (!Number.isFinite(expiry) || expiry < Date.now()) return null;

  const signature = fromHex(signaturePart);
  if (!signature) return null;

  try {
    const key = await importKey(getSecret());
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      signature as unknown as BufferSource,
      encoder.encode(`${idPart}.${expiryPart}`)
    );
    return ok ? id : null;
  } catch {
    return null;
  }
}
