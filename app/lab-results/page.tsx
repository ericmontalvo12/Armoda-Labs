import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileText, FlaskConical } from "lucide-react";

export const metadata: Metadata = {
  title: "Certificates of Analysis",
  description:
    "Independent certificates of analysis for every lot supplied by Armoda Labs, matched to the lot number printed on the vial.",
  alternates: { canonical: "/lab-results" },
};

// One entry per tested lot, newest first. When a certificate arrives, drop the
// PDF in public/coa/ named with its lot number so files never collide, then
// add a row here.
//
// NOTHING SHIPS BEFORE ITS ROW EXISTS. Publishing a certificate against a lot
// number is the only claim this brand makes; shipping a lot whose certificate
// is not published makes every other certificate worth less.
const batches: {
  product: string;
  lot: string;
  tested: string;
  href: string;
}[] = [];

const tested = [
  {
    title: "Identity",
    body: "Confirmed by mass spectrometry against the expected molecular mass. Purity alone cannot establish identity, so both are reported.",
  },
  {
    title: "Purity",
    body: "Measured by HPLC and reported as the percentage of the chromatogram attributable to the target compound, with the method stated.",
  },
  {
    title: "Peptide content",
    body: "The net mass of peptide in the vial, which is a separate measurement from purity — a vial can assay as highly pure and still contain less material than stated.",
  },
  {
    title: "Water content and residual solvents",
    body: "Both contribute mass that is not peptide, so both are measured rather than assumed.",
  },
  {
    title: "Lot and method",
    body: "The lot number, the date analyzed, the laboratory, and the analytical method used, so the result can be traced and repeated.",
  },
];

export default function LabResults() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top pb-20">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
            Certificates of Analysis
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary">
            Every lot is analyzed by an independent laboratory before release.
            Certificates are published here against the lot number printed on
            the vial, so what you read describes the material you received —
            not a reference batch from an earlier run. They are posted
            unedited.
          </p>

          <section className="mt-10 space-y-4">
            {batches.length === 0 ? (
              <div className="rounded-[20px] border border-border bg-surface p-10 text-center">
                <p className="font-heading text-base font-extrabold text-text-primary">
                  No certificates published yet
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
                  Certificates appear here as lots are analyzed and released.
                  Nothing is offered for sale before its certificate is
                  published.
                </p>
              </div>
            ) : (
              batches.map((batch) => (
                <div
                  key={batch.lot}
                  className="flex flex-col gap-5 rounded-[20px] border border-border bg-surface p-6 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="font-heading font-extrabold text-text-primary">
                      {batch.product}
                    </h2>
                    <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <div>
                        <dt className="mb-0.5 text-xs uppercase tracking-wide text-text-muted">
                          Lot
                        </dt>
                        <dd className="font-medium tabular-nums text-text-primary">
                          {batch.lot}
                        </dd>
                      </div>
                      <div>
                        <dt className="mb-0.5 text-xs uppercase tracking-wide text-text-muted">
                          Analyzed
                        </dt>
                        <dd className="font-medium tabular-nums text-text-primary">
                          {batch.tested}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <a
                    href={batch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-[10px] bg-primary px-5 py-3 font-heading text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    View certificate
                  </a>
                </div>
              ))
            )}
          </section>

          <section className="mt-14">
            <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-text-primary">
              <FlaskConical className="h-5 w-5 text-gold" aria-hidden="true" />
              What the certificate reports
            </h2>
            <div className="mt-6 space-y-5">
              {tested.map((item) => (
                <div key={item.title}>
                  <h3 className="font-heading text-sm font-extrabold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-[20px] border border-border bg-surface p-6">
            <p className="text-sm leading-relaxed text-text-secondary">
              A certificate reports what a lot was measured to contain. It is
              not a statement about what the compound does, and nothing here
              should be read as one.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Questions about a specific lot?{" "}
              <Link href="/contact" className="text-gold hover:underline">
                Contact us
              </Link>{" "}
              with the lot number printed on your vial.
            </p>
          </section>

          <div className="mt-10">
            <Link
              href="/products"
              className="font-heading text-sm font-bold text-gold hover:underline"
            >
              Browse the catalog →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
