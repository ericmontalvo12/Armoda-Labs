import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

/**
 * Catalog hero. Deliberately makes no claim about what any compound does —
 * the trust signals are testing and handling, which are facts about the
 * operation rather than assertions about an effect.
 */
export function CatalogHero() {
  return (
    <section className="bg-surface-elevated">
      <div className="page-top mx-auto grid max-w-[1280px] items-center gap-10 px-4 pb-14 lg:grid-cols-2 lg:pb-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-muted bg-background px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-gold-text">
            <ShieldCheck className="h-3.5 w-3.5" />
            Third-party tested
          </span>

          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.1] text-text-primary sm:text-5xl">
            Research peptides,
            <br />
            <span className="text-gold-text">independently verified</span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-text-secondary">
            Defined-sequence peptides for laboratory research. Every lot is
            third-party assayed, and the certificate of analysis is published
            against the lot number you receive.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex h-11 items-center rounded-[10px] bg-primary px-6 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Browse catalog
            </Link>
            <Link
              href="/lab-results"
              className="inline-flex h-11 items-center rounded-[10px] border border-border bg-background px-6 font-heading text-base font-bold text-text-primary transition-colors hover:border-gold hover:text-gold-text"
            >
              View test results
            </Link>
          </div>

          <p className="mt-6 text-xs text-text-muted">
            For laboratory research use only. Not for human or veterinary use.
          </p>
        </div>

        <div className="relative">
          <Image
            src="/product-placeholder.svg"
            alt=""
            width={560}
            height={420}
            priority
            className="mx-auto h-auto w-full max-w-[460px]"
          />
        </div>
      </div>
    </section>
  );
}
