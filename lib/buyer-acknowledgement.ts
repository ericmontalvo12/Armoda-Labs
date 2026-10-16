/**
 * The buyer acknowledgement shown at checkout.
 *
 * This exists because a clause in the terms is something a customer can say
 * they never read, while a box they ticked is something they affirmatively
 * asserted. It is the strongest eligibility record available without
 * identity verification, and it is what a payment processor's compliance
 * review looks for.
 *
 * It does NOT verify anything. We cannot confirm a buyer's age, their
 * qualifications, or what they intend to do with the material — nobody
 * selling online can. What this records is the representation the buyer
 * made at the point of sale, which is the thing the terms are conditioned
 * on.
 *
 * VERSION THIS STRING. The stored acknowledgement is only evidence of what
 * someone agreed to if we can say what the words were on the day they
 * agreed. Bump ACK_VERSION whenever ACK_TEXT changes, and never edit past
 * text in place.
 */
export const ACK_VERSION = "2026-10-16.v1";

export const MINIMUM_AGE = 21;

export const ACK_TEXT =
  `I confirm I am at least ${MINIMUM_AGE} years of age, that I am acquiring this material ` +
  "for laboratory research use only, and that I will not consume it or " +
  "administer it to any human or animal.";

/** Metadata keys written onto the payment session and stored with the order. */
export const ACK_METADATA_KEYS = {
  accepted: "buyer_ack",
  version: "buyer_ack_version",
  at: "buyer_ack_at",
} as const;
