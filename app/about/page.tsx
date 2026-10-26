import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopHeader } from "@/components/products/ShopHeader";
import { Truck, Lock, Headphones, CreditCard, Landmark, Bitcoin } from "lucide-react";

// ---------------------------------------------------------------------------
// PLACEHOLDER FACTS — every value here is a factual claim about the business
// and none of it is invented copy you can safely ship. The purity figure in
// particular is a claim that has to be backed by the certificates it cites: a
// headline number higher than what a lot actually tests at is the kind of
// discrepancy that a regulator reads as a misbranding, and a buyer reads as a
// reason to stop trusting the COAs. Fill these in from real records, or cut
// the elements that carry them.
// ---------------------------------------------------------------------------
const FACTS = {
  founded: "TBC",
  experience: "TBC",
  purity: "TBC",
  origin: "TBC",
  /** Shown under the ring. Keep it to what the test method actually shows. */
  purityCaption: "Verified purity",
  methodLine: "HPLC tested · Third-party verified",
};

const PROMISES = [
  {
    icon: Truck,
    eyebrow: "Fast & reliable",
    title: "Same-day dispatch",
    body: "Orders placed before the weekday cut-off ship the same day. Express is available where the destination allows it.",
  },
  {
    icon: Lock,
    eyebrow: "Private & protected",
    title: "Secure ordering",
    body: "Checkout is encrypted end to end. Card details go to the payment processor. We never see them.",
    // Rendered only once the processor question is settled — see CLAUDE.md.
    methods: [
      { icon: CreditCard, label: "Card" },
      { icon: Landmark, label: "Bank transfer" },
      { icon: Bitcoin, label: "Digital currency" },
    ],
    methodsPending: true,
  },
  {
    icon: Headphones,
    eyebrow: "Always available",
    title: "Support when you need it",
    body: "Questions about documentation, handling or an order reach a person who can answer them.",
  },
];

function Statement({
  eyebrow,
  note,
  title,
  accent,
  children,
}: {
  eyebrow: string;
  note: string;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 border-t border-border py-14 lg:grid-cols-[220px_1fr] lg:gap-12">
      <div>
        <p className="text-xs font-heading font-bold uppercase tracking-[0.14em] text-gold">
          <span aria-hidden="true">◆ </span>
          {eyebrow}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{note}</p>
      </div>
      <div>
        <h2 className="font-heading text-2xl font-extrabold leading-tight text-text-primary sm:text-3xl">
          {title} <span className="text-gold">{accent}</span>
        </h2>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main>
        <ShopHeader
          eyebrow="Who we are"
          title="Who we are"
          crumbs={[{ label: "Home", href: "/" }, { label: "Who we are" }]}
        />

        {/* Intro split: positioning left, verification figure right */}
        <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-heading font-bold uppercase tracking-[0.14em] text-gold">
              <span aria-hidden="true">◆ </span>Who we are
            </p>
            <p className="mt-4 text-xs font-heading uppercase tracking-[0.2em] text-text-muted">
              Est. {FACTS.founded} · {FACTS.origin} · Research supply
            </p>
            <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[1.1] text-text-primary sm:text-5xl">
              A research supplier built on{" "}
              <span className="text-gold">precision</span> and verification
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-text-secondary">
              Armoda Labs supplies defined-sequence peptides for laboratory
              research. Every lot is tested by an independent laboratory and
              the certificate is published against the lot number on the vial,
              so what you read is the material you received.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-11 items-center rounded-[10px] bg-primary px-6 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover"
              >
                Explore products
              </Link>
              <Link
                href="/lab-results"
                className="inline-flex h-11 items-center rounded-[10px] border border-border px-6 font-heading text-base font-bold text-text-primary transition-colors hover:border-gold hover:text-gold"
              >
                View test results
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex h-56 w-56 items-center justify-center rounded-full border-4 border-gold sm:h-64 sm:w-64">
              <div className="text-center">
                <span className="block font-heading text-5xl font-extrabold text-text-primary">
                  {FACTS.purity}
                </span>
                <span className="mt-2 block text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-text-muted">
                  {FACTS.purityCaption}
                </span>
              </div>
            </div>
            <p className="mt-6 text-center text-[11px] font-heading font-bold uppercase tracking-[0.14em] text-gold">
              {FACTS.methodLine}
            </p>
          </div>
        </section>

        {/* Stat bar */}
        <section className="border-y border-border bg-surface">
          <dl className="mx-auto grid max-w-[1280px] grid-cols-2 divide-border px-4 py-10 sm:grid-cols-4 sm:divide-x">
            {[
              ["Founded", FACTS.founded],
              ["Experience", FACTS.experience],
              ["Purity", FACTS.purity],
              ["Origin", FACTS.origin],
            ].map(([label, value], i) => (
              <div key={label} className={i > 0 ? "sm:pl-8" : ""}>
                <dt className="text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-text-muted">
                  {label}
                </dt>
                <dd className="mt-2 font-heading text-2xl font-extrabold text-text-primary sm:text-3xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mx-auto max-w-[1280px] px-4">
          <Statement
            eyebrow="Our mission"
            note="What we are here to do."
            title="A supplier of"
            accent="record"
          >
            <p>
              A researcher should be able to tell exactly what is in the vial
              before they open it. Identity, purity, lot. Documented, not
              asserted.
            </p>
            <p>
              Everything here is for laboratory research use, sold to buyers
              qualified to handle it. Not for human use. Not for veterinary
              use. We make no claim about what any compound does, because we
              are not entitled to.
            </p>
          </Statement>

          <Statement
            eyebrow="Our philosophy"
            note="Why we spend money on testing nobody checks."
            title="We publish the number we"
            accent="hit"
          >
            <p>
              Every lot goes to an independent laboratory before it goes
              anywhere else. The results are published as they come back. If a
              lot tests below specification, it does not ship. We do not
              re-test it until it passes.
            </p>
            <p>
              This is partly principle and partly arithmetic. Marketing
              claims in this category are not ours to make, and vendors who
              make them tend not to be around long. Documentation is the only
              thing we can honestly sell.
            </p>
            <Link
              href="/lab-results"
              className="inline-block border-b border-gold pb-0.5 font-heading text-sm font-bold text-gold hover:border-gold-hover hover:text-gold-hover"
            >
              View test results →
            </Link>
          </Statement>
        </div>

        {/* What you can count on */}
        <section className="bg-surface">
          <div className="mx-auto max-w-[1280px] px-4 py-16">
            <p className="text-center text-xs font-heading font-bold uppercase tracking-[0.14em] text-gold">
              <span aria-hidden="true">◆ </span>What you can count on
            </p>
            <h2 className="mt-3 text-center font-heading text-2xl font-extrabold text-text-primary sm:text-3xl">
              Built around the way researchers work
            </h2>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {PROMISES.map(({ icon: Icon, eyebrow, title, body, methods, methodsPending }) => (
                <div
                  key={title}
                  className="rounded-[20px] border border-border bg-background p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-surface-accent">
                    <Icon className="h-5 w-5 text-gold" />
                  </span>
                  <p className="mt-5 text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-gold">
                    {eyebrow}
                  </p>
                  <h3 className="mt-2 font-heading text-base font-extrabold text-text-primary">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {body}
                  </p>

                  {methods && (
                    <>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {methods.map(({ icon: MIcon, label }) => (
                          <span
                            key={label}
                            className="inline-flex items-center gap-1.5 rounded-[10px] border border-border px-2.5 py-1.5 text-xs text-text-secondary"
                          >
                            <MIcon className="h-3.5 w-3.5 text-gold" />
                            {label}
                          </span>
                        ))}
                      </div>
                      {methodsPending && (
                        <p className="mt-3 text-[11px] text-text-muted">
                          Methods shown are indicative pending processor
                          confirmation.
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
