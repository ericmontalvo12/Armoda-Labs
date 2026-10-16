import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about ordering from Armoda Labs: certificates of analysis, storage and handling, shipping, eligibility and payment.",
  alternates: { canonical: "/faq" },
};

/**
 * Every answer here describes the material, the documentation or the service.
 * None describes an effect, a use in a person, a dose or a protocol — those
 * questions get the same answer, which is that we cannot advise on them.
 * The previous version of this page gave dosing instructions ("take 3
 * capsules daily with food") for a supplement, which is exactly the shape of
 * content that makes a research-use position unbelievable.
 */
const SECTIONS = [
  {
    heading: "Products and documentation",
    faqs: [
      {
        q: "What exactly do you supply?",
        a: "Defined-sequence peptides supplied as lyophilized preparations in sealed vials, for laboratory research use. Each vial is labeled with its compound, net quantity and lot number.",
      },
      {
        q: "What is a certificate of analysis?",
        a: "A report from an independent laboratory stating what a given lot was measured to contain — identity confirmed by mass spectrometry, and purity by HPLC. We publish one per lot and match it to the lot number printed on your vial, so the certificate you read describes the material you received rather than a reference batch.",
      },
      {
        q: "Why does identity testing matter as well as purity?",
        a: "They answer different questions. Purity tells you what proportion of the contents is a single compound; identity confirms that compound is the one on the label. A vial can be highly pure and still be the wrong molecule, so we report both.",
      },
      {
        q: "The lot number on my vial is not listed.",
        a: "Contact us with the lot number and we will send the certificate directly. Nothing ships before it is tested, so a missing entry is a publishing gap on our side, not an untested lot.",
      },
    ],
  },
  {
    heading: "Handling and storage",
    faqs: [
      {
        q: "How should material be stored?",
        a: "Storage conditions for each compound are printed on the vial and stated on its product page. As a general matter, lyophilized peptides are stored frozen for long-term stability and tolerate ambient temperature in transit.",
      },
      {
        q: "Can you advise on reconstitution, dosing or protocols?",
        a: "No. We supply material and its documentation. We do not provide dosing, protocols, administration guidance or any advice on use in humans or animals, and nothing we publish should be read as such.",
      },
    ],
  },
  {
    heading: "Ordering and eligibility",
    faqs: [
      {
        q: "Who can order?",
        a: "Material is supplied for laboratory research use only, to buyers qualified to receive and handle it, who must be 21 or over. It is not supplied for human or veterinary use. You confirm this at checkout before an order can be placed.",
      },
      {
        q: "Can I return an order?",
        a: "No. All sales are final. Once material leaves our custody its storage and handling cannot be verified, so it can never return to inventory. Where we can verify that something went wrong with an order we resolve it with store credit, and we never ask for the product back.",
      },
      {
        q: "How quickly do orders ship?",
        a: "Orders placed before the weekday cut-off are dispatched the same day. Delivery estimates after that are the carrier's and are not guaranteed.",
      },
      {
        q: "Do you ship internationally?",
        a: "Where local import rules allow. Import duties and customs charges are the recipient's responsibility, and parcels seized or returned by customs are not refundable. Check your own jurisdiction's rules before ordering.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top pb-20">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Ordering, documentation, handling and eligibility. For anything not
            covered here,{" "}
            <Link href="/contact" className="text-gold hover:underline">
              get in touch
            </Link>
            .
          </p>

          <div className="mt-12 space-y-12">
            {SECTIONS.map(({ heading, faqs }) => (
              <section key={heading}>
                <h2 className="font-heading text-lg font-extrabold text-text-primary">
                  {heading}
                </h2>
                <dl className="mt-5 space-y-6">
                  {faqs.map(({ q, a }) => (
                    <div
                      key={q}
                      className="rounded-[20px] border border-border bg-surface p-6"
                    >
                      <dt className="font-heading text-sm font-extrabold text-text-primary">
                        {q}
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
                        {a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-[20px] border border-border bg-surface-elevated p-8 text-center">
            <h2 className="font-heading text-lg font-extrabold text-text-primary">
              Still have questions?
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              We answer questions about specification, documentation and
              handling. We cannot advise on use.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-11 items-center rounded-[10px] bg-primary px-6 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Contact us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
