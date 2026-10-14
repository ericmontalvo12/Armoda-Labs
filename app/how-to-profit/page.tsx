import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Users, Building2, Percent, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Profit",
  description:
    "Partner programmes at Armoda Labs: referrals, institutional accounts, and volume pricing for qualifying laboratories and distributors.",
  alternates: { canonical: "/how-to-profit" },
};

// PLACEHOLDER CONTENT — rates, thresholds and terms are invented and must be
// set before launch.
//
// COMPLIANCE NOTE: this page is in tension with research-use-only positioning.
// A programme that rewards volume resale to the public cuts against the claim
// that material is supplied to qualified researchers, and the contradiction is
// exactly what regulators cite. The framing below is deliberately restricted
// to institutional and qualified-buyer channels, with eligibility gated rather
// than open. Counsel should review this page specifically, alongside the
// resale-restriction clause in the terms.
const programmes = [
  {
    icon: Users,
    title: "Referral programme",
    body: "Refer a colleague or laboratory. Both accounts receive credit against their next order once the referred account completes its first purchase.",
    terms: "Credit applies to account balance. Not redeemable for cash.",
  },
  {
    icon: Building2,
    title: "Institutional accounts",
    body: "Universities, contract research organisations and private laboratories can open an account with purchase-order terms, consolidated invoicing and a named point of contact.",
    terms: "Requires documentation of institutional affiliation.",
  },
  {
    icon: Percent,
    title: "Volume pricing",
    body: "Tiered pricing applies automatically above defined order thresholds, with further terms available for recurring supply agreements.",
    terms: "Thresholds shown at checkout.",
  },
];

export default function HowToProfitPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top pb-20">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
            Partner With Armoda
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Referral credit, institutional accounts and volume terms for
            qualifying laboratories, research organisations and distributors.
          </p>

          <div className="mt-10 space-y-4">
            {programmes.map(({ icon: Icon, title, body, terms }) => (
              <div
                key={title}
                className="rounded-[20px] border border-border bg-surface p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-surface-accent">
                    <Icon className="h-5 w-5 text-gold-text" />
                  </span>
                  <div>
                    <h2 className="font-heading text-base font-extrabold text-text-primary">
                      {title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {body}
                    </p>
                    <p className="mt-3 text-xs text-text-muted">{terms}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-[20px] border border-gold-muted bg-surface-elevated p-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold-text" />
            <div>
              <h2 className="font-heading text-sm font-extrabold text-text-primary">
                Eligibility
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Partner accounts are available to qualified institutional and
                commercial buyers only. Material supplied under any programme
                remains for laboratory research use and may not be resold,
                repackaged or distributed for human or veterinary use.
                Applications are reviewed individually and we may decline or
                withdraw an account at our discretion.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Content partners publish under our{" "}
                <Link
                  href="/affiliate-terms"
                  className="text-gold hover:underline"
                >
                  affiliate and partner terms
                </Link>
                , which prohibit describing human use, dosing or outcomes and
                require content to be approved before publication.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-[20px] bg-gold p-8 text-center">
            <h2 className="font-heading text-xl font-extrabold text-text-on-gold">
              Apply for an account
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-on-gold/80">
              Tell us about your organisation and expected volume. We respond
              to applications within two business days.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-11 items-center rounded-[10px] bg-[#14110e] px-6 font-heading text-base font-bold text-gold-text transition-colors hover:bg-[#2a251e]"
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
