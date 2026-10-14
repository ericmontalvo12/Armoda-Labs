import Link from "next/link";
import { Lock } from "lucide-react";
import { NewsletterBand } from "@/components/NewsletterBand";

// Only routes that exist. Social links are omitted rather than pointed at
// placeholders — the inherited ones went to the other brand's accounts.
const footerLinks = {
  Company: [
    { label: "Who We Are", href: "/about" },
    { label: "Shop", href: "/products" },
    { label: "Certificates of Analysis", href: "/lab-results" },
    { label: "Partner With Us", href: "/how-to-profit" },
  ],
  Account: [
    { label: "Cart", href: "/cart" },
    { label: "Track Your Order", href: "/manage" },
    { label: "How to Pay", href: "/how-to-pay" },
  ],
  "Help & Trust": [
    { label: "Help", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};

export function Footer() {
  return (
    <>
      <NewsletterBand />

      <footer className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <span className="font-heading text-xl font-extrabold tracking-tight text-text-primary">
                ARMODA<span className="text-gold">LABS</span>
              </span>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
                Defined-sequence research peptides, independently assayed with
                a certificate of analysis published for every lot.
              </p>

              <div className="mt-6">
                <p className="flex items-center gap-2 font-heading text-sm font-bold text-text-primary">
                  <Lock className="h-4 w-4 text-gold" />
                  Secure checkout
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  Encrypted end to end. Accepted payment methods are confirmed
                  at checkout.
                </p>
              </div>
            </div>

            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h2 className="font-heading text-sm font-extrabold text-text-primary">
                  {heading}
                </h2>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-secondary transition-colors hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/*
            Research-use notice.

            This REPLACES the DSHEA supplement disclaimer inherited from Rock
            Mountain ("These statements have not been evaluated by the Food and
            Drug Administration... not intended to diagnose, treat, cure or
            prevent any disease"). That text is the dietary-supplement safe
            harbour: using it asserts the product IS a supplement intended for
            human consumption, which is the opposite of this site's position.
            Carrying it over would have been worse than having no disclaimer.

            WORDING IS NOT FINAL — placeholder pending the disclaimer work in
            CLAUDE.md (open decision 3). Counsel must set the final text, and
            the categories still missing here are an age gate, buyer
            qualification, no-medical-advice and export restrictions, which
            conventionally live in the terms rather than the footer.
          */}
          <div className="mt-12 space-y-4 border-t border-border pt-8">
            <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-text-muted">
              All products supplied by Armoda Labs are for laboratory research
              use only. Not for human or veterinary consumption. Materials must
              be handled only by qualified professionals. Nothing on this site
              is a drug, food or cosmetic, and nothing here is medical advice.
            </p>
            <p className="text-center text-sm text-text-muted">
              &copy; {new Date().getFullYear()} Armoda Labs. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
