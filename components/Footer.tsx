import Link from "next/link";
import { NewsletterBand } from "@/components/NewsletterBand";

// A single horizontal row, as on the reference, rather than link columns.
const NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Catalog", href: "/products" },
  { label: "FAQs", href: "/faq" },
  { label: "How to Pay", href: "/how-to-pay" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Affiliate", href: "/affiliate" },
  { label: "Certificates", href: "/lab-results" },
  { label: "Help", href: "/help" },
];

const POLICIES = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Shipping & Claims", href: "/shipping-and-claims" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Affiliate Terms", href: "/affiliate-terms" },
  { label: "Third-Party Content", href: "/ugc-policy" },
];

/**
 * Named legal sections rather than one paragraph, so each restriction is
 * findable and quotable on its own.
 *
 * Two are worth keeping beyond the obvious. Regulatory status states what
 * this business is NOT — not a compounding pharmacy under 503A, not an
 * outsourcing facility under 503B — which forecloses a reading nobody has
 * made yet but someone eventually will. Official website is anti-counterfeit:
 * stating there are no authorized resellers means a cloned storefront taking
 * payment cannot claim to be us.
 *
 * WORDING IS NOT FINAL — pending the legal review in TODO.md.
 */
const LEGAL = [
  {
    h: "Research Use Only",
    p: "All products supplied by Armoda Labs are intended strictly for laboratory research use. They are not drugs, dietary supplements, food, food additives, cosmetics or veterinary products, and are not for human or animal consumption.",
  },
  {
    h: "Regulatory Status",
    p: "Armoda Labs is a supplier of research reagents. It is not a compounding pharmacy or chemical compounding facility as defined under Section 503A of the Federal Food, Drug, and Cosmetic Act, and is not an outsourcing facility as defined under Section 503B of that Act.",
  },
  {
    h: "Intended Use and Handling",
    p: "The products we offer are not intended for human use. They are intended for in vitro and pre-clinical research purposes only. The purchaser acknowledges that risks exist in the handling, use and distribution of these products, certifies that it has the equipment, facilities and personnel to manage those risks, and knowingly accepts them. These chemicals are not intended to be used, and should not be used, in inappropriate applications — including, without limitation, as food additives, drugs, cosmetics or household chemicals, or in any application outside of in vitro laboratory research, pre-clinical research, or laboratory chemical synthesis and materials testing.",
  },
  {
    h: "Customer Responsibility",
    p: "By purchasing these products, the customer agrees to the above. In the event the customer uses, or causes others to use, these products outside of these restrictions, the customer accepts all risk of doing so, absolves Armoda Labs of any responsibility for such actions, and agrees to indemnify and hold Armoda Labs harmless against any third-party claims arising from them.",
  },
  {
    h: "Official Website",
    p: "Armoda Labs sells only through this website. We operate no other store and have no authorized resellers or distributors. If any other website asks you to send payment for Armoda Labs products, it is not us.",
  },
];

export function Footer() {
  return (
    <>
      <NewsletterBand />

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 py-14">
          <div className="text-center">
            <span className="font-heading text-2xl font-extrabold tracking-tight text-text-primary">
              ARMODA<span className="text-gold">LABS</span>
            </span>
          </div>

          <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading text-sm font-bold text-text-secondary transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-12 rounded-[20px] border border-border bg-surface-elevated p-7 sm:p-10">
            <div className="space-y-7">
              {LEGAL.map(({ h, p }) => (
                <div key={h}>
                  <h2 className="font-heading text-sm font-extrabold text-text-primary">
                    {h}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
                    {p}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-xs text-text-muted">
              &copy; {new Date().getFullYear()} Armoda Labs. All rights
              reserved.
            </p>
            <div className="flex flex-wrap gap-x-7 gap-y-3 sm:justify-end">
              {POLICIES.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-text-secondary transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
