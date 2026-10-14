// NOT THE SOURCE OF TRUTH FOR DISCOUNT CODES.
//
// app/api/validate-promo/route.ts resolves codes against the payment
// processor (Stripe promotionCodes), not against this file, and nothing
// imports lookupPromoCode. The site advertises ARMODA10 in EmailPopup and
// JoinCommunity, but that code only works once it exists as an active
// promotion code in the processor dashboard — renaming it here or in the
// components does not create it.
//
// Kept because it is the natural place for a processor-independent fallback
// if the processor decision (CLAUDE.md, open decision 1) lands somewhere
// without a hosted promotions feature.
//
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
