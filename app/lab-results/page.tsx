import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileText, FlaskConical } from "lucide-react";

export const metadata: Metadata = {
  title: "Lab Results",
  description:
    "Certificates of Analysis for every batch of Peak Performance — ingredient amounts, microbiological testing, and batch details.",
  alternates: { canonical: "/lab-results" },
};

// One entry per manufactured lot, newest first. When a new COA arrives, drop
// the PDF in public/coa/ named with its lot number so files never collide,
// then add a row here.
const batches = [
  {
    product: "Peak Performance (90 ct)",
    lot: "260319",
    manufactured: "June 15, 2026",
    bestBy: "June 2028",
    href: "/coa/peak-performance-90ct-lot-260319.pdf",
  },
];

const tested = [
  {
    title: "Active ingredients",
    body: "Every active in the formula listed against its label claim — vitamin D3, zinc, magnesium, boron, KSM-66 ashwagandha, fenugreek, and tongkat ali — with the amount each batch is required to meet.",
  },
  {
    title: "Microbiological safety",
    body: "Total aerobic microbial count, total yeast and mold, E. coli, Salmonella, and Staphylococcus aureus. These analyses are performed by ISO 17025-accredited third-party laboratories.",
  },
  {
    title: "Physical inspection",
    body: "Appearance, color, odor, and capsule integrity — checked against specification for every batch before it ships.",
  },
  {
    title: "Testing methodology",
    body: "Microbiological analyses are performed by ISO 17025-accredited third-party laboratories. Active ingredient amounts are substantiated under 21 CFR 111.75 through component testing and batch production record review, a standard method for finished supplements.",
  },
];

export default function LabResults() {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-surface/50">
      <Header />
      <main className="pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Lab Results
          </h1>

          <p className="text-text-secondary mb-10 max-w-2xl leading-relaxed">
            Every batch of Peak Performance ships with a Certificate of Analysis.
            It names the lot, the manufacturing date, every active ingredient
            with its label claim, and the microbiological panel the batch was
            required to pass. They&apos;re all here, unedited.
          </p>

          {/* Batches */}
          <section className="space-y-4 mb-14">
            {batches.map((batch) => (
              <div
                key={batch.lot}
                className="bg-white border border-border rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading font-semibold text-text-primary mb-3">
                    {batch.product}
                  </h2>
                  <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <div>
                      <dt className="text-text-muted text-xs uppercase tracking-wide mb-0.5">
                        Lot
                      </dt>
                      <dd className="text-text-primary font-medium tabular-nums">
                        {batch.lot}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-text-muted text-xs uppercase tracking-wide mb-0.5">
                        Manufactured
                      </dt>
                      <dd className="text-text-primary font-medium">
                        {batch.manufactured}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-text-muted text-xs uppercase tracking-wide mb-0.5">
                        Best by
                      </dt>
                      <dd className="text-text-primary font-medium">
                        {batch.bestBy}
                      </dd>
                    </div>
                  </dl>
                </div>

                <a
                  href={batch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 flex-shrink-0"
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  View Certificate
                </a>
              </div>
            ))}
          </section>

          {/* What the certificate covers */}
          <section className="mb-12">
            <h2 className="font-heading text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" aria-hidden="true" />
              What&apos;s on the certificate
            </h2>
            <div className="space-y-5">
              {tested.map((item) => (
                <div key={item.title}>
                  <h3 className="font-semibold text-text-primary text-sm mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Batch questions — routed to support, not framed as a caveat. */}
          <section>
            <p className="text-text-secondary text-sm leading-relaxed">
              Questions about a specific batch? Email{" "}
              <a
                href="mailto:contact@rockmountainperformance.com"
                className="text-primary hover:underline"
              >
                contact@rockmountainperformance.com
              </a>{" "}
              with the lot number from your bottle.
            </p>
          </section>

          <div className="mt-10">
            <Link
              href="/formula"
              className="text-primary text-sm font-medium hover:underline"
            >
              See every ingredient and the research behind it →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
