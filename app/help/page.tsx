import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Package,
  Truck,
  RotateCcw,
  FlaskConical,
  CreditCard,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help",
  description:
    "Order tracking, shipping, returns, certificates of analysis and payment help for Armoda Labs.",
  alternates: { canonical: "/help" },
};

const topics = [
  {
    icon: Package,
    title: "Orders",
    body: "Track an order, change an address before dispatch, or check why an item is held.",
    href: "/manage",
    cta: "Track an order",
  },
  {
    icon: Truck,
    title: "Shipping",
    body: "Dispatch times, cold-chain handling, and what to do if a parcel arrives damaged or warm.",
    href: "/contact",
    cta: "Shipping questions",
  },
  {
    icon: RotateCcw,
    title: "Returns & refunds",
    body: "What can be returned, the window for raising an issue, and how refunds are processed.",
    href: "/refund-policy",
    cta: "Refund policy",
  },
  {
    icon: FlaskConical,
    title: "Certificates of analysis",
    body: "Find the COA matching the lot number on your vial, and how to read the assay.",
    href: "/lab-results",
    cta: "Browse certificates",
  },
  {
    icon: CreditCard,
    title: "Payment",
    body: "Accepted methods, declines, invoicing and institutional purchase orders.",
    href: "/how-to-pay",
    cta: "How to pay",
  },
  {
    icon: Mail,
    title: "Contact us",
    body: "Anything not covered here. Include your order number if you have one.",
    href: "/contact",
    cta: "Get in touch",
  },
];

const faqs = [
  {
    q: "How is material shipped?",
    a: "Lyophilised peptides are shipped at ambient temperature, which they tolerate in transit. Orders placed before the weekday cut-off are dispatched the same day.",
  },
  {
    q: "The lot number on my vial is not in the certificates list.",
    a: "Contact us with the lot number and we will send the certificate directly. Every lot is assayed before dispatch, so a missing entry is a publishing gap on our side, not an untested lot.",
  },
  {
    q: "Can I change or cancel an order?",
    a: "Before dispatch, yes — contact us as quickly as you can with your order number. Once a parcel is handed to the carrier it cannot be recalled.",
  },
  {
    q: "Do you ship internationally?",
    a: "Destinations vary with local import rules. Where we cannot lawfully ship, checkout will not accept the address. Import duties are the recipient's responsibility.",
  },
  {
    q: "Who can order?",
    a: "Material is supplied for laboratory research use only, to buyers qualified to receive and handle it. It is not supplied for human or veterinary use.",
  },
];

export default function HelpPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
            Help
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Find an answer below, or get in touch and a person will reply.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {topics.map(({ icon: Icon, title, body, href, cta }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-[20px] border border-border bg-surface p-6 transition-colors hover:border-gold"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-surface-accent">
                  <Icon className="h-5 w-5 text-gold-text" />
                </span>
                <h2 className="mt-4 font-heading text-base font-extrabold text-text-primary">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {body}
                </p>
                <span className="mt-3 inline-block text-sm font-heading font-bold text-gold-text group-hover:underline">
                  {cta} →
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mt-14 font-heading text-xl font-extrabold text-text-primary">
            Frequently asked
          </h2>
          <dl className="mt-6 space-y-6">
            {faqs.map(({ q, a }) => (
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
