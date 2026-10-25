"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { PanelHeading } from "@/components/sections/home/PanelHeading";

/**
 * Homepage FAQ. Deliberately covers eligibility, storage and testing — not
 * use. The "what can't you advise on" answer is here on purpose: stating the
 * limit on the homepage is stronger than burying it in the terms.
 */
const FAQS = [
  {
    q: "What do you supply?",
    a: "Defined-sequence peptides as lyophilized preparations in sealed vials, for laboratory research use. Each vial is labeled with its compound, net quantity and lot number.",
  },
  {
    q: "How should material be stored?",
    a: "Storage conditions are printed on the vial and stated on each product page. Lyophilized peptides are generally held frozen for long-term stability and tolerate ambient temperature in transit.",
  },
  {
    q: "What analytical testing do you perform?",
    a: "Identity by mass spectrometry and purity by HPLC, with peptide content, water content and residual solvents measured as well. Certificates are published per lot and matched to the lot number on your vial.",
  },
  {
    q: "Who is eligible to order?",
    a: "Buyers aged 21 or over who are acquiring material for laboratory research and are qualified to handle it. You confirm this at checkout before an order can be placed.",
  },
  {
    q: "Can you advise on dosing or protocols?",
    a: "No. We supply material and its documentation. We do not provide dosing, protocols or administration guidance, and nothing we publish should be read as such.",
  },
  {
    q: "Do you ship internationally?",
    a: "Where local import rules allow. Duties and customs charges are the recipient's responsibility, and parcels seized or returned by customs are not refundable.",
  },
];

export function NeedToKnow() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="bg-background pb-20">
      <div className="mx-auto max-w-[1280px] px-4">
        <PanelHeading title="Need to know" />

        <div className="mt-8 space-y-3">
          {FAQS.map(({ q, a }) => {
            const isOpen = open === q;
            return (
              <div
                key={q}
                className="overflow-hidden rounded-[14px] border border-border bg-surface"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : q)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-gold" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-gold" />
                  )}
                  <span className="font-heading text-sm font-bold text-text-primary">
                    {q}
                  </span>
                </button>
                {isOpen && (
                  <p className="border-t border-border px-5 py-4 pl-14 text-sm leading-relaxed text-text-secondary">
                    {a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex h-12 items-center rounded-full border border-gold px-8 font-heading text-base font-bold text-gold transition-colors hover:bg-gold hover:text-text-on-gold"
          >
            Read more FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}
