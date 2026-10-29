import Link from "next/link";
import { FileSearch } from "lucide-react";

/**
 * The claim, stated as an action rather than a sentence.
 *
 * Every other band on this page tells the reader that certificates exist.
 * This one hands them the door. A brand built on documentation should make
 * looking it up the easiest thing on the homepage.
 */
export function CertificateBand() {
  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="relative overflow-hidden rounded-[24px] border border-gold-muted bg-surface-elevated px-6 py-12 text-center sm:px-12">
          <span className="absolute left-1/2 top-0 h-[3px] w-28 -translate-x-1/2 bg-gold" />

          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-muted bg-surface-accent">
            <FileSearch className="h-6 w-6 text-gold" strokeWidth={1.3} />
          </span>

          <h2 className="mt-6 font-heading text-2xl font-extrabold text-text-primary sm:text-3xl">
            Check a lot before you buy from us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-secondary">
            Every certificate is published against the lot number printed on
            the vial. You do not need an account to read one, and you do not
            need to have ordered.
          </p>

          <Link
            href="/lab-results"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-8 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover"
          >
            Look up a certificate
          </Link>
        </div>
      </div>
    </section>
  );
}
