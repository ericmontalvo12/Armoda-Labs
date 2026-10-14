// Client-safe review config (no server-only imports, so this can be
// imported from both the API route and client components).

// Whether a review requires a verified Stripe purchase before it publishes.
export const REQUIRE_VERIFIED_PURCHASE = true;

export const MAX_REVIEW_PHOTO_BYTES = 2 * 1024 * 1024; // 2MB
