import { FlaskConical, Truck, Lock, FileCheck } from "lucide-react";

/**
 * Operational facts only — shipping, testing, handling, payment security.
 * Nothing here says what a compound does, which keeps the strip clear of
 * intended-use territory while still carrying the trust load.
 */
const ITEMS = [
  { icon: FlaskConical, title: "Third-party assayed", sub: "Every lot, HPLC & MS" },
  { icon: FileCheck, title: "COA per lot", sub: "Matched to your vial" },
  { icon: Truck, title: "Cold-chain dispatch", sub: "Same-day on weekdays" },
  { icon: Lock, title: "Secure checkout", sub: "Encrypted end to end" },
];

export function TrustStrip() {
  return (
    <section className="bg-primary">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-6 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/10">
              <Icon className="h-5 w-5 text-gold" />
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-sm font-bold text-white">
                {title}
              </span>
              <span className="block text-xs text-text-on-dark-muted">{sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
