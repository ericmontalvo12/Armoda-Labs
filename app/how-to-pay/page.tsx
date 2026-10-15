import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CreditCard, Landmark, Bitcoin, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Pay",
  description:
    "Accepted payment methods at Armoda Labs, how each one is processed, and what to do if a payment is declined.",
  alternates: { canonical: "/how-to-pay" },
};

// PLACEHOLDER CONTENT. Which of these methods actually exist depends on the
// unresolved processor decision (see CLAUDE.md, open decision 1). Nothing here
// should go live until the merchant account is confirmed — listing a method
// that is not actually available is worse than listing none.
const methods = [
  {
    icon: CreditCard,
    title: "Card",
    body: "Visa, Mastercard, American Express and Discover, processed on an encrypted checkout. Your card details are handled by the processor and never reach our servers.",
    status: "Pending processor confirmation",
  },
  {
    icon: Landmark,
    title: "Bank transfer (ACH / wire)",
    body: "Available for larger institutional orders. Your order is reserved when the transfer is initiated and dispatched once funds settle, typically one to three business days.",
    status: "Pending processor confirmation",
  },
  {
    icon: Bitcoin,
    title: "Digital currency",
    body: "Settled at the rate quoted at checkout, with the quote held for a fixed window. Confirmation times vary by network.",
    status: "Pending processor confirmation",
  },
];

const faqs = [
  {
    q: "Why was my card declined?",
    a: "Declines are issued by your bank, not by us, and we are not told the reason. The usual causes are an address mismatch, an international-transaction block, or a daily limit. Contacting your bank resolves most of them.",
  },
  {
    q: "When am I charged?",
    a: "At the point of order. If an item cannot be fulfilled, that portion is refunded to the original payment method.",
  },
  {
    q: "Is my payment information stored?",
    a: "No. Card details are handled entirely by the payment processor. We receive a confirmation and the last four digits, nothing more.",
  },
  {
    q: "Do you charge sales tax or duties?",
    a: "Tax is calculated at checkout where applicable. International orders may incur import duties set by the destination country, which are the recipient's responsibility.",
  },
];

export default function HowToPayPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top pb-20">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
            How to Pay
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Accepted methods, how each is processed, and what to do when a
            payment does not go through.
          </p>

          <div className="mt-10 space-y-4">
            {methods.map(({ icon: Icon, title, body, status }) => (
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
                    <p className="mt-3 text-xs font-heading font-bold uppercase tracking-wider text-gold-text">
                      {status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-[20px] border border-border-subtle bg-surface-elevated p-6">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-text" />
            <p className="text-sm leading-relaxed text-text-secondary">
              Checkout runs over an encrypted connection and card data is
              handled by the payment processor. Armoda Labs never sees or
              stores your full card number.
            </p>
          </div>

          <h2 className="mt-14 font-heading text-xl font-extrabold text-text-primary">
            Common questions
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

          <p className="mt-12 text-sm text-text-secondary">
            Still stuck?{" "}
            <Link href="/help" className="font-medium text-gold-text hover:underline">
              Visit the help center
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="font-medium text-gold-text hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
