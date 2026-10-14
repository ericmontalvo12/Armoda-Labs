import { FlaskConical, Truck, Lock, FileCheck } from "lucide-react";

/**
 * Operational facts only — shipping, testing, handling, payment security.
 * Nothing here says what a compound does, which keeps the strip clear of
 * intended-use territory while still carrying the trust load.
 *
 * On the dark theme this is a bordered band rather than a filled bar: a
 * solid gold strip at this width would overwhelm the page, and gold works
 * harder as an accent on the icons than as a background.
 */
const ITEMS = [
  { icon: FlaskConical, title: "Third-party assayed", sub: "Every lot, HPLC & MS" },
  { icon: FileCheck, title: "COA per lot", sub: "Matched to your vial" },
  { icon: Truck, title: "Cold-chain dispatch", sub: "Same-day on weekdays" },
  { icon: Lock, title: "Secure checkout", sub: "Encrypted end to end" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-7 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-gold-muted bg-surface-accent">
              <Icon className="h-5 w-5 text-gold" />
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-sm font-bold text-text-primary">
                {title}
              </span>
              <span className="block text-xs text-text-muted">{sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
