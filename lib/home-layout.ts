/**
 * Which arrangement the homepage uses.
 *
 * Three orderings of the same sections, each answering a different question
 * about what a first-time visitor should hit first. Switching is this one
 * value; app/page.tsx reads it and nothing else changes.
 *
 *   "commerce"      products first. Shortest path from landing to a product
 *                   page. The catalog is not gated, so there is nothing to
 *                   justify before showing it.
 *
 *   "proof"         the certificate lookup first. Leads with the claim the
 *                   brand is built on and lets someone verify it before
 *                   being sold anything. Slowest path to a product.
 *
 *   "editorial"     fewer bands, more room. The argument is made once and
 *                   properly rather than repeated in four panels.
 */
export type HomeLayout = "commerce" | "proof" | "editorial";

export const HOME_LAYOUT: HomeLayout = "commerce";
