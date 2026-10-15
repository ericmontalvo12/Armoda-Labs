import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Building2, Percent, FileText, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Wholesale",
  description:
    "Wholesale and institutional accounts at Armoda Labs — purchase-order terms, consolidated invoicing and tiered pricing for qualifying laboratories and distributors.",
  alternates: { canonical: "/wholesale" },
};

// PLACEHOLDER — thresholds, discounts and terms are invented scaffolding.
// Set them from real margin before this page goes live.
const TIERS = [
  { tier: "Tier 1", threshold: "TBC", discount: "TBC" },
  { tier: "Tier 2", threshold: "TBC", discount: "TBC" },
  { tier: "Tier 3", threshold: "TBC", discount: "TBC" },
];

const FEATURES = [
  {
    icon: Building2,
    title: "Institutional accounts",
    body: "Universities, contract research organizations and private laboratories can order against a purchase order with consolidated invoicing and a named point of contact.",
  },
  {
    icon: Percent,
    title: "Tiered pricing",
    body: "Volume pricing applies automatically above defined thresholds, with further terms available for recurring supply agreements.",
  },
  {
    icon: FileText,
    title: "Documentation",
    body: "Certificates of analysis are provided per lot, matched to the lot numbers shipped, in the format your records require.",
  },
];

export default function WholesalePage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top pb-20">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-heading font-bold uppercase tracking-[0.14em] text-gold">
            <span aria-hidden="true">◆ </span>Wholesale
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
            Wholesale &amp; institutional accounts
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Account terms and volume pricing for qualifying laboratories,
            research organizations and distributors.
          </p>

          <div className="mt-10 space-y-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-[20px] border border-border bg-surface p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-surface-accent">
                    <Icon className="h-5 w-5 text-gold" />
                  </span>
                  <div>
                    <h2 className="font-heading text-base font-extrabold text-text-primary">
                      {title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-14 font-heading text-xl font-extrabold text-text-primary">
            Volume tiers
          </h2>
          <div className="mt-5 overflow-hidden rounded-[20px] border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-accent">
                <tr>
                  <th className="px-5 py-3 font-heading text-xs font-bold uppercase tracking-wider text-text-muted">
                    Tier
                  </th>
                  <th className="px-5 py-3 font-heading text-xs font-bold uppercase tracking-wider text-text-muted">
                    Order value
                  </th>
                  <th className="px-5 py-3 font-heading text-xs font-bold uppercase tracking-wider text-text-muted">
                    Discount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {TIERS.map(({ tier, threshold, discount }) => (
                  <tr key={tier}>
                    <td className="px-5 py-3 font-heading font-bold text-text-primary">
                      {tier}
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{threshold}</td>
                    <td className="px-5 py-3 text-text-secondary">{discount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-[20px] border border-gold-muted bg-surface-elevated p-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <div>
              <h2 className="font-heading text-sm font-extrabold text-text-primary">
                Eligibility
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Wholesale accounts are available to qualified institutional and
                commercial buyers only. Material supplied under any account
                remains for laboratory research use and may not be resold,
                repackaged or distributed for human or veterinary use.
                Applications are reviewed individually and we may decline or
                withdraw an account at our discretion.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-[20px] bg-gold p-8 text-center">
            <h2 className="font-heading text-xl font-extrabold text-text-on-gold">
              Apply for an account
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-on-gold/80">
              Tell us about your organization and expected volume. We respond
              to applications within two business days.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-11 items-center rounded-[10px] bg-[#14110e] px-6 font-heading text-base font-bold text-gold transition-colors hover:bg-[#2a251e]"
            >
              Start an application
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
