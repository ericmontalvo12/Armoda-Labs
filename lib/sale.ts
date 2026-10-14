// Single source of truth for the time-limited sale. Update SALE_END to
// change the deadline — prices and the countdown revert automatically once
// it passes. Enforced both in the UI and server-side in the checkout API,
// so a stale client can't replay the sale price after it ends.
export const SALE_END = new Date("2026-08-28T23:59:59-06:00");

export function isSaleActive(atDate: Date = new Date()): boolean {
  return atDate.getTime() < SALE_END.getTime();
}

type Tier = 1 | 2 | 3;

const REGULAR_TOTALS: Record<Tier, number> = { 1: 49.99, 2: 94.99, 3: 119.99 };
const SALE_TOTALS: Record<Tier, number> = { 1: 39.95, 2: 75.95, 3: 95.95 };

function tierFor(quantity: number): Tier {
  if (quantity >= 3) return 3;
  if (quantity === 2) return 2;
  return 1;
}

export function getBundleTotal(quantity: number, atDate: Date = new Date()): number {
  const totals = isSaleActive(atDate) ? SALE_TOTALS : REGULAR_TOTALS;
  return totals[tierFor(quantity)];
}

export function getRegularBundleTotal(quantity: number): number {
  return REGULAR_TOTALS[tierFor(quantity)];
}

export function getPricePerBottle(quantity: number, atDate: Date = new Date()): number {
  return parseFloat((getBundleTotal(quantity, atDate) / tierFor(quantity)).toFixed(2));
}

export function getRegularPricePerBottle(quantity: number): number {
  return parseFloat((getRegularBundleTotal(quantity) / tierFor(quantity)).toFixed(2));
}

export const SUBSCRIPTION_PRICE = 39.99;
export const SUBSCRIPTION_PRICE_CENTS = 3999;
