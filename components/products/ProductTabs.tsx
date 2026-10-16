"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Table, FlaskConical, HelpCircle } from "lucide-react";
import type { Product } from "@/lib/catalog";

/**
 * There is deliberately no "Research" tab.
 *
 * The reference site uses one to host pharmacology write-ups, and that is
 * the single highest-risk surface on a peptide PDP: summarising what a
 * compound does to a receptor, next to an add-to-cart button, is how a
 * research-use position gets read as a therapeutic claim. Overview stays
 * descriptive (what the material IS), Properties is a spec table, and
 * citations — if they are ever added — belong somewhere that is not a
 * purchase page, attributed to the study rather than to the product.
 */
const TABS = [
  { key: "overview", label: "Overview", icon: FileText },
  { key: "properties", label: "Properties", icon: Table },
  { key: "lab", label: "Lab results", icon: FlaskConical },
  { key: "faq", label: "FAQ", icon: HelpCircle },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const FAQS = [
  {
    q: "How is this material supplied?",
    a: "As a lyophilized powder in a sealed vial, shipped at ambient temperature, which the format tolerates in transit.",
  },
  {
    q: "Where is the certificate of analysis?",
    a: "Published against the lot number printed on the vial. If the lot is not listed, contact us and we will send it directly.",
  },
  {
    q: "Who is eligible to order?",
    a: "Material is supplied for laboratory research use only, to buyers qualified to receive and handle it. It is not supplied for human or veterinary use.",
  },
  {
    q: "Can this be returned?",
    a: "No. All sales are final. Once material leaves our custody we cannot verify how it was stored or handled, so it can never re-enter inventory — accepting returns would mean either destroying them or reselling material we can no longer stand behind.",
  },
  {
    q: "What if my order arrives damaged, or does not arrive?",
    a: "Contact us with your order number and photographs within the claim window. Damaged, lost and incorrectly picked shipments are replaced or refunded without a return — we do not want the vial back.",
  },
];

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<TabKey>("overview");

  return (
    <div className="rounded-[20px] border border-border bg-surface">
      <div role="tablist" aria-label="Product information" className="flex flex-wrap gap-1 border-b border-border p-2">
        {TABS.map(({ key, label, icon: Icon }) => {
          const selected = key === active;
          return (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(key)}
              className={`inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 font-heading text-sm font-bold transition-colors ${
                selected
                  ? "bg-background text-gold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="p-6 sm:p-8">
        {active === "overview" && (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
              <p>
                {product.overview ??
                  `${product.name} is supplied as a lyophilized preparation for laboratory research use. Identity and purity are confirmed by an independent laboratory before release, and the certificate is published against the lot number on the vial.`}
              </p>
              <ul className="space-y-2 pt-2">
                {[
                  "Independently assayed before release",
                  "Certificate of analysis published per lot",
                  "Supplied as a lyophilized preparation",
                  "For laboratory research use only",
                ].map((line) => (
                  <li key={line} className="flex gap-2 text-text-primary">
                    <span aria-hidden="true" className="text-gold">✓</span>
                    <span className="text-sm">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="rounded-[20px] border border-border bg-background p-6 text-sm leading-relaxed text-text-secondary">
              Every lot is tested by an independent laboratory before it is
              released for dispatch. Certificates are published on the lab
              results page and are matched to the lot number on the vial you
              receive, not to a reference batch.
            </aside>
          </div>
        )}

        {active === "properties" && (
          <>
            {product.properties && product.properties.length > 0 ? (
              <dl className="divide-y divide-border">
                {product.properties.map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-2 gap-4 py-3">
                    <dt className="text-sm text-text-muted">{label}</dt>
                    <dd className="text-sm text-text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-text-secondary">
                Specification for {product.name} — sequence, molecular formula,
                mass, purity and storage — is published here once the data is
                finalised for this SKU.
              </p>
            )}
          </>
        )}

        {active === "lab" && (
          <div className="text-sm leading-relaxed text-text-secondary">
            <p>
              Certificates of analysis are published per lot and matched to the
              lot number printed on your vial.
            </p>
            <Link
              href="/lab-results"
              className="mt-4 inline-block border-b border-gold pb-0.5 font-heading text-sm font-bold text-gold hover:border-gold-hover hover:text-gold-hover"
            >
              Browse certificates →
            </Link>
          </div>
        )}

        {active === "faq" && (
          <dl className="space-y-6">
            {FAQS.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-heading text-sm font-extrabold text-text-primary">
                  {q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
