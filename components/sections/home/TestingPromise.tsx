import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";

/** Split band: how material is verified. Process facts, no effect claims. */
export function TestingPromise() {
  return (
    <section className="bg-surface">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 py-14 lg:grid-cols-2">
        <Image
          src="/product-placeholder.svg"
          alt=""
          width={600}
          height={420}
          className="h-auto w-full rounded-[20px] border border-border bg-surface-elevated"
        />
        <div>
          <SectionHeading
            eyebrow="Why Armoda"
            title="Verified before it ships"
            align="left"
          />
          <p className="mt-5 text-sm leading-relaxed text-text-secondary">
            Every lot is assayed by an independent laboratory for identity and
            purity. Results are published against the lot number printed on the
            vial, so the certificate you read is the material you received — not
            a reference batch from a previous run.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Material is supplied for laboratory research only, to buyers
            qualified to handle it.
          </p>
          <Link
            href="/lab-results"
            className="mt-7 inline-flex h-11 items-center rounded-[10px] border border-border bg-background px-6 font-heading text-base font-bold text-text-primary transition-colors hover:border-gold hover:text-gold-deep"
          >
            Browse certificates
          </Link>
        </div>
      </div>
    </section>
  );
}
