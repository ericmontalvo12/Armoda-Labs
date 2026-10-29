import Link from "next/link";
import { Check, FlaskConical } from "lucide-react";
import { HeroActions } from "@/components/sections/home/HeroActions";

/**
 * Hero as an inset panel rather than a full-bleed band, with gold rules
 * breaking the top edge.
 *
 * The reference's CTAs are Login / Apply for account, because its catalog is
 * gated behind a reviewed account. Ours are not gated, so those buttons would
 * lead nowhere — they become Browse catalog / View test results. The callout
 * beside them says what is actually true here: eligibility is confirmed at
 * checkout, not vetted by a person.
 */
export function HeroPanel() {
  return (
    <section className="page-top bg-background pb-16">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="relative overflow-hidden rounded-[24px] border border-border bg-surface px-6 py-12 sm:px-12 sm:py-16">
          {/* Rules breaking the top edge */}
          <span className="absolute left-10 top-0 h-[3px] w-28 bg-gold" />
          <span className="absolute right-10 top-0 h-[3px] w-28 bg-gold/40" />

          <div className="grid items-center gap-10 lg:grid-cols-[260px_1fr]">
            <div className="flex justify-center lg:justify-start">
              <span className="flex h-40 w-40 items-center justify-center rounded-full border border-gold-muted bg-surface-accent">
                <FlaskConical className="h-16 w-16 text-gold" strokeWidth={1.1} />
              </span>
            </div>

            <div>
              {/* A badge, then the claims stacked. The reference leads with
                  what it does rather than what it believes, which is the
                  right order: a thesis has to be read, a fact is scanned.
                  Nothing here is a guarantee, because a purity figure cannot
                  be promised in advance of testing the lot. */}
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-muted bg-surface-elevated px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider text-gold-text">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                Certificate on every lot
              </span>

              <h1 className="mt-6 max-w-2xl font-heading text-4xl font-extrabold leading-[1.12] text-text-primary sm:text-5xl">
                Independently tested.
                <br />
                <span className="text-gold-text">Published per lot.</span>
                <br />
                Shipped in 1 to 2 days.
              </h1>

              <div className="mt-8 max-w-xl">
                <p className="text-base leading-relaxed text-text-secondary">
                  Research peptides and receptor modulators for laboratory use.
                  Identity by mass spectrometry, purity by HPLC, both done by a
                  lab that does not work for us.
                </p>

                <blockquote className="mt-6 border-l-2 border-gold bg-surface-elevated px-5 py-4">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    The certificate you read is for the lot number printed on
                    your vial. Not a reference batch. Not an earlier run. If
                    the numbers do not match, do not use it.
                  </p>
                </blockquote>
              </div>

              <div className="mt-10 border-t border-border pt-5">
                <p className="max-w-3xl text-xs leading-relaxed text-text-muted">
                  <span className="font-heading font-bold text-text-secondary">
                    RESEARCH USE ONLY.
                  </span>{" "}
                  All materials supplied by Armoda Labs are intended strictly
                  for laboratory research use. They are not drugs, dietary
                  supplements, food or cosmetics, and are not intended to
                  diagnose, treat, cure or prevent any disease. Purchasers must
                  be qualified to handle research chemicals and are responsible
                  for compliance with all applicable laws.
                </p>
              </div>

              <HeroActions />

              {/* The catalog is not gated, so it still needs a route from the
                  hero. Kept as a tertiary link rather than a third button so
                  the two account CTAs stay the primary pair. */}
              <p className="mt-5 text-sm text-text-secondary">
                Or{" "}
                <Link href="/lab-results" className="font-heading font-bold text-gold hover:underline">
                  read a certificate first
                </Link>
                . No account required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
