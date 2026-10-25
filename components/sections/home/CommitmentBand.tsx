import { FlaskConical, Truck, Tags, Lock } from "lucide-react";

/**
 * Four operational commitments. Every one is a fact about how the operation
 * runs — testing, dispatch, labeling, checkout security. None describes what
 * a compound does, which is the line the whole site holds.
 */
const ITEMS = [
  { icon: FlaskConical, label: "COA on every lot" },
  { icon: Truck, label: "Ships in 1–2 business days once payment clears" },
  { icon: Tags, label: "Proper labeling and handling" },
  { icon: Lock, label: "Encrypted checkout" },
];

export function CommitmentBand() {
  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="relative overflow-hidden rounded-[24px] border border-border bg-surface-elevated px-6 py-10 sm:px-12">
          <span className="absolute left-10 top-0 h-[3px] w-24 bg-gold" />

          <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-12">
            <div className="lg:border-r lg:border-border lg:pr-12">
              <h2 className="font-heading text-xl font-extrabold text-text-primary">
                <span
                  aria-hidden="true"
                  className="mr-2 inline-block h-3 w-3 translate-y-[1px] bg-gold"
                />
                Our commitment
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Verified material, documented handling and predictable
                dispatch — every order, every lot.
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {ITEMS.map(({ icon: Icon, label }) => (
                <li key={label} className="text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[16px] border border-gold-muted bg-surface-accent">
                    <Icon className="h-7 w-7 text-gold" strokeWidth={1.3} />
                  </span>
                  <p className="mt-4 font-heading text-sm font-bold leading-snug text-text-primary">
                    {label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
