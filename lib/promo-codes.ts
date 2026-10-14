// Add promo codes here. amountOff is in cents (e.g. 500 = $5.00).
// Set the env var PROMO_CODES_JSON to override at runtime:
// PROMO_CODES_JSON='{"SAVE10":{"percentOff":10}}'

type PromoCode = {
  percentOff?: number;
  amountOff?: number; // cents
};

const DEFAULT_CODES: Record<string, PromoCode> = {
  // Example: SAVE10 gives 10% off
  // "SAVE10": { percentOff: 10 },
};

function loadCodes(): Record<string, PromoCode> {
  const raw = process.env.PROMO_CODES_JSON;
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      console.error("Invalid PROMO_CODES_JSON env var");
    }
  }
  return DEFAULT_CODES;
}

export function lookupPromoCode(code: string): PromoCode | null {
  const codes = loadCodes();
  return codes[code.toUpperCase()] ?? null;
}
