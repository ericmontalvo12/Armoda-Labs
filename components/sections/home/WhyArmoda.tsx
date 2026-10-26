import Link from "next/link";
import { PanelHeading } from "@/components/sections/home/PanelHeading";

export function WhyArmoda() {
  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="relative overflow-hidden rounded-[24px] border border-border bg-surface px-6 py-10 sm:px-12 sm:py-12">
          <span className="absolute left-10 top-0 h-[3px] w-24 bg-gold" />
          <PanelHeading title="Why Armoda Labs?" />

          <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-text-secondary">
            <p>
              Most vendors publish a purity number. Purity tells you how much
              of something is in the vial. It does not tell you what that
              something is.
            </p>
            <p>
              So we run two tests on every lot, at an independent laboratory.
              Mass spectrometry for identity. HPLC for purity. Both results go
              on the certificate, filed under the lot number stamped on your
              vial.
            </p>
            <p>
              This costs us money on every batch. We think buyers who read
              certificates are worth having.
            </p>
          </div>

          <Link
            href="/about"
            className="mt-8 inline-flex h-11 items-center rounded-full border border-border px-7 font-heading text-sm font-bold text-text-primary transition-colors hover:border-gold hover:text-gold"
          >
            Learn more about us
          </Link>
        </div>
      </div>
    </section>
  );
}
