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
    a: "Lyophilized peptides in sealed vials, for laboratory research use. Each vial carries its compound name, net quantity and lot number.",
  },
  {
    q: "How should material be stored?",
    a: "Frozen, for long-term stability. The exact conditions are printed on the vial and listed on the product page. Lyophilized material tolerates ambient temperature in transit, so a warm parcel is not a ruined one.",
  },
  {
    q: "What analytical testing do you perform?",
    a: "Identity by mass spectrometry. Purity by HPLC. We also measure peptide content, water content and residual solvents. Every result is published under the lot number on your vial.",
  },
  {
    q: "Who is eligible to order?",
    a: "You must be 21 or over, buying for laboratory research, and qualified to handle the material. You confirm this at checkout. No order goes through without it.",
  },
  {
    q: "Can you advise on dosing or protocols?",
    a: "No. We supply material and its documentation. We do not give dosing, protocols or administration guidance, and nothing we publish should be read that way. Do not ask.",
  },
  {
    q: "Do you ship internationally?",
    a: "Where local import rules allow. Duties and customs charges are yours. If customs seizes or returns a parcel, we cannot refund it, so check your own rules first.",
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
