import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Account Login",
  description: "Account access for approved Armoda Labs customers.",
  alternates: { canonical: "/account/login" },
  robots: { index: false, follow: true },
};

/**
 * No login form, because there is no authentication system behind it.
 *
 * A form that accepts a password and does nothing teaches people their
 * password does not matter here, and invites them to reuse a real one
 * against an endpoint that will not protect it. Until accounts exist, this
 * page says what access actually is. Replace the whole page when they do —
 * see TODO.md.
 */
export default function AccountLoginPage() {
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
              Account access
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              Customer accounts are still being built. Ordering does not
              require one — the catalog is open, and eligibility is confirmed
              at checkout.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              If you have applied for an account, we will contact you directly
              once it is ready.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-heading text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover"
              >
                Browse the catalog
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-full border border-border px-6 font-heading text-sm font-bold text-text-primary transition-colors hover:border-gold hover:text-gold"
              >
                Contact us
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Not applied yet?{" "}
            <Link href="/apply" className="font-heading font-bold text-gold hover:underline">
              Apply for an account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
