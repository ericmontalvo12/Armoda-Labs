export interface Carrier {
  id: string;
  label: string;
  /** Builds a public tracking URL, so the email can link rather than just show a number. */
  trackingUrl: (n: string) => string;
  /** Loose sanity check on the number's shape. Deliberately permissive - carriers
   *  change formats, and a false rejection is worse than a typo reaching the email. */
  looksValid: (n: string) => boolean;
}

export const CARRIERS: Carrier[] = [
  {
    id: "usps",
    label: "USPS",
    trackingUrl: (n) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(n)}`,
    looksValid: (n) => /^[0-9]{20,22}$|^(94|93|92|95)[0-9]{18,20}$|^[A-Z]{2}[0-9]{9}US$/i.test(n),
  },
  {
    id: "ups",
    label: "UPS",
    trackingUrl: (n) => `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}`,
    looksValid: (n) => /^1Z[0-9A-Z]{16}$/i.test(n) || /^[0-9]{9,18}$/.test(n),
  },
  {
    id: "fedex",
    label: "FedEx",
    trackingUrl: (n) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}`,
    looksValid: (n) => /^[0-9]{12,22}$/.test(n),
  },
  {
    id: "dhl",
    label: "DHL",
    trackingUrl: (n) => `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(n)}`,
    looksValid: (n) => /^[0-9]{10,11}$/.test(n) || /^[A-Z0-9]{10,20}$/i.test(n),
  },
  {
    id: "other",
    label: "Other / manual",
    // No carrier site to link to; the email shows the bare number.
    trackingUrl: () => "",
    looksValid: (n) => n.trim().length >= 4,
  },
];

export function getCarrier(id: string): Carrier | undefined {
  return CARRIERS.find((c) => c.id === id);
}

/** Normalises user input - operators paste numbers with spaces and dashes. */
export function normaliseTracking(raw: string): string {
  return raw.replace(/[\s-]/g, "").trim();
}
