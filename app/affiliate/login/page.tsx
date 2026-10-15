import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KeyRound, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Login",
  description:
    "Partner portal access for Armoda Labs affiliates.",
  alternates: { canonical: "/affiliate/login" },
  robots: { index: false, follow: true },
};

/**
 * There is no affiliate authentication system yet — no accounts table, no
 * session handling, no dashboard. So this page does NOT render a login form:
 * a form that accepts credentials and does nothing teaches partners their
 * password does not matter, and invites them to reuse a real one against an
 * endpoint that will not protect it.
 *
 * It explains how access currently works instead. Replace this whole page
 * when the portal is built — see TODO.md.
 */
export default function AffiliateLoginPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top pb-20">
        <div className="mx-auto max-w-lg px-4">
          <div className="rounded-[20px] border border-border bg-surface p-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[10px] bg-surface-accent">
              <KeyRound className="h-5 w-5 text-gold" />
            </span>
            <h1 className="mt-5 font-heading text-2xl font-extrabold text-text-primary">
              Partner access
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              The self-serve partner dashboard is still being built. Until it
              is live, approved partners receive their code, current
              attribution totals and the asset library directly from us.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              If you are already a partner and need your figures or a
              replacement code, get in touch and we will send them over.
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-6 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover"
            >
              <Mail className="h-4 w-4" />
              Contact us
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Not a partner yet?{" "}
            <Link
              href="/affiliate"
              className="font-heading font-bold text-gold hover:underline"
            >
              See the affiliate program
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
