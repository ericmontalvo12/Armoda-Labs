"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Percent,
  Tag,
  DollarSign,
  Clock,
  Package,
  Wallet,
  TrendingUp,
  X,
  ShieldCheck,
  FileText,
  Share2,
  Images,
  Link2,
  Plus,
  Minus,
  Mail,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// ---------------------------------------------------------------------------
// PLACEHOLDER COMMERCIAL TERMS. Every number here is scaffolding, not an offer.
// The estimator reads COMMISSION_RATE, so setting the real rate updates the
// hero, the stat strip and the calculator together. Until these are set from
// real margin, the page says on its face that they are indicative.
// ---------------------------------------------------------------------------
const COMMISSION_RATE = 0.2;
const AUDIENCE_DISCOUNT = "10%";
const APPROVAL_WINDOW = "24h";

const commissionLabel = `${Math.round(COMMISSION_RATE * 100)}%`;

const HERO_CHIPS = [
  `${commissionLabel} commission`,
  `${AUDIENCE_DISCOUNT} code for your audience`,
  "No cost to join",
  "No earnings cap",
];

const STATS = [
  { icon: Percent, label: "Commission", value: commissionLabel },
  { icon: Tag, label: "Audience code", value: AUDIENCE_DISCOUNT },
  { icon: DollarSign, label: "To join", value: "$0" },
  { icon: Clock, label: "Approval", value: APPROVAL_WINDOW },
];

const STEPS = [
  {
    n: "01",
    title: "Apply and get approved",
    body: "No fee and no contract term. We review who you are and where you publish, and respond within a business day.",
  },
  {
    n: "02",
    title: "Share your code",
    body: "You get a discount code to use in posts, articles and your bio. Attribution runs on the code, so nothing depends on a cookie surviving.",
  },
  {
    n: "03",
    title: "Earn on referred orders",
    body: `Collect ${commissionLabel} on the net value of every order placed with your code. No cap on what you can earn.`,
  },
];

const PERKS = [
  {
    icon: Wallet,
    title: "Commission on every order",
    body: `${commissionLabel} on net order value, with ${AUDIENCE_DISCOUNT} off for the person using your code.`,
  },
  {
    icon: Package,
    title: "Product for content",
    body: "Approved partners receive product to photograph and document, so your content is your own rather than restocked stock imagery.",
  },
  {
    icon: Tag,
    title: "Partner pricing",
    body: "A standing discount on your own orders, separate from the code you share.",
  },
  {
    icon: TrendingUp,
    title: "Wholesale access",
    body: "Partners moving consistent volume can move onto wholesale terms.",
  },
];

const RULES = [
  {
    title: "No coupon or deal aggregators",
    body: "Submitting your code to coupon sites is prohibited. Those sites intercept buyers who were already purchasing, so the commission is paid for no referral.",
  },
  {
    title: "No bidding on our brand",
    body: "You may not bid on keywords containing our name in paid search, or build pages designed to outrank us for it.",
  },
  {
    title: "No self-referrals",
    body: "Your own orders do not earn commission, whether or not the code is applied. Partner pricing covers your own purchases instead.",
  },
  {
    title: "Codes are applied at checkout",
    body: "The customer enters the code themselves. We cannot apply codes to orders retrospectively.",
  },
];

const GUIDELINES = [
  {
    icon: FileText,
    tag: "Content",
    title: "Document, don't testify",
    body: "The strongest content here is documentary: open the parcel, read the certificate, check the lot number against the vial, compare price per milligram. It is specific, it is verifiable, and it needs no claim to be interesting.",
  },
  {
    icon: Share2,
    tag: "Reach",
    title: "Go where the audience is",
    body: "Long-form on YouTube and written comparisons tend to convert better here than short-form, and they age better. Forum and community presence works where the rules permit it.",
  },
  {
    icon: Images,
    tag: "Assets",
    title: "Use the supplied assets",
    body: "We provide product imagery, certificate graphics and pre-cleared copy lines. Anything from that library is already approved, which removes the slowest step from your workflow.",
  },
  {
    icon: Link2,
    tag: "Disclosure",
    title: "Disclose in the content itself",
    body: "Your compensation must be disclosed where the content is, not only in a profile or a link in bio. In video that means spoken and on screen.",
  },
];

const FAQS = [
  {
    q: "How much can I earn?",
    a: `Commission is ${commissionLabel} of net order value on every order placed with your code, with no upper limit. Net value excludes shipping, tax, and any order later refunded or charged back.`,
  },
  {
    q: "Does it cost anything to join?",
    a: "No. There is no fee, no minimum commitment and no contract term. We can both end the arrangement at any time.",
  },
  {
    q: "When do I get my code?",
    a: "On approval, usually within a business day of applying. The code is unique to you and is how every order gets attributed.",
  },
  {
    q: "Can I use my own code?",
    a: "Not for commission — self-referrals do not earn. Approved partners get separate partner pricing on their own orders.",
  },
  {
    q: "What exactly can't I say?",
    a: "Nothing describing use of our products in a person or animal: no personal use accounts, no dosing or protocols, no claims of any outcome or effect, no before-and-after imagery, and no presenting the material as a drug or supplement. Because we compensate you, your content counts as our advertising, which is why this is a hard line rather than a preference.",
  },
  {
    q: "Why does content need approving first?",
    a: "It protects you as much as us. A post that breaches the rules has to come down and forfeits its commission, and approval takes about a day — far less than rebuilding a video.",
  },
];

function Section({
  eyebrow,
  title,
  children,
  tinted = false,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  tinted?: boolean;
}) {
  return (
    <section className={tinted ? "bg-surface" : "bg-background"}>
      <div className="mx-auto max-w-[1280px] px-4 py-16">
        <p className="text-center text-xs font-heading font-bold uppercase tracking-[0.14em] text-gold">
          <span aria-hidden="true">— </span>
          {eyebrow}
        </p>
        <h2 className="mt-3 text-center font-heading text-2xl font-extrabold text-text-primary sm:text-3xl">
          {title}
        </h2>
        <div className="mx-auto mt-3 h-[3px] w-14 rounded-full bg-gold" />
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export default function AffiliatePage() {
  const [monthly, setMonthly] = useState(3000);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const perMonth = Math.round(monthly * COMMISSION_RATE);
  const perYear = perMonth * 12;
  const money = (n: number) => `$${n.toLocaleString("en-US")}`;

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main>
        {/* Hero */}
        <section className="page-top bg-surface pb-16">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-muted bg-background px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-gold">
                Armoda Labs partner program
              </span>
              <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.1] text-text-primary sm:text-5xl">
                Get paid on{" "}
                <span className="text-gold">every order you refer</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-text-secondary">
                Earn {commissionLabel} on every referred order and give your
                audience {AUDIENCE_DISCOUNT} off. Free to join, no contract, no
                minimum. You are promoting the certificates, not a claim — which
                is a far easier thing to stand behind.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2">
                {HERO_CHIPS.map((chip) => (
                  <li
                    key={chip}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-heading font-bold text-text-secondary"
                  >
                    <Check className="h-3.5 w-3.5 text-gold" />
                    {chip}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center rounded-[10px] bg-primary px-7 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover"
                >
                  Apply now
                </Link>
                <p className="text-sm text-text-secondary">
                  Already a partner?{" "}
                  <Link
                    href="/affiliate/login"
                    className="font-heading font-bold text-gold hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>

            {/* Growth illustration — bars are decorative, not data */}
            <div className="rounded-[20px] border border-border bg-background p-7">
              <div className="flex items-center justify-between">
                <p className="text-xs font-heading font-bold uppercase tracking-wider text-text-muted">
                  Commission growth
                </p>
                <span className="rounded-full bg-surface-accent px-3 py-1 text-xs font-heading font-bold text-gold">
                  Up to {commissionLabel}
                </span>
              </div>
              <div
                className="mt-8 flex h-44 items-end justify-between gap-3"
                aria-hidden="true"
              >
                {[34, 48, 62, 78, 100].map((h, i) => (
                  <div
                    key={h}
                    className="flex-1 rounded-t-[6px] bg-gold"
                    style={{ height: `${h}%`, opacity: 0.45 + i * 0.14 }}
                  />
                ))}
              </div>
              <p className="mt-6 text-center text-xs leading-relaxed text-text-muted">
                Earnings scale with referred orders. There is no upper limit and
                no tier you have to reach first.
              </p>
            </div>
          </div>
        </section>

        {/* Stat strip */}
        <section className="border-y border-border bg-surface-elevated">
          <dl className="mx-auto grid max-w-[1280px] grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-surface-elevated px-4 py-8 text-center"
              >
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-[10px] bg-surface-accent">
                  <Icon className="h-4 w-4 text-gold" />
                </span>
                <dt className="mt-4 text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-text-muted">
                  {label}
                </dt>
                <dd className="mt-2 font-heading text-3xl font-extrabold text-gold">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="px-4 pb-6 text-center text-xs text-text-muted">
            Rates shown are indicative while the program is being finalised
            and are confirmed in writing on approval.
          </p>
        </section>

        {/* Estimator */}
        <section className="bg-background">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-16 lg:grid-cols-2">
            <div>
              <p className="text-xs font-heading font-bold uppercase tracking-[0.14em] text-gold">
                <span aria-hidden="true">— </span>See the maths
              </p>
              <h2 className="mt-3 font-heading text-2xl font-extrabold text-text-primary sm:text-3xl">
                Estimate your monthly earnings
              </h2>
              <div className="mt-3 h-[3px] w-14 rounded-full bg-gold" />
              <p className="mt-5 max-w-md text-sm leading-relaxed text-text-secondary">
                Move the slider to the order value you expect to refer each
                month. At {commissionLabel} commission your income scales
                directly with it — there is no cap and no tier gate.
              </p>
            </div>

            <div className="rounded-[20px] border border-border bg-surface p-7">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="monthly-referred"
                  className="text-sm font-heading font-bold text-text-primary"
                >
                  Monthly orders you refer
                </label>
                <span className="font-heading text-lg font-extrabold text-gold">
                  {money(monthly)}
                </span>
              </div>
              <input
                id="monthly-referred"
                type="range"
                min={500}
                max={25000}
                step={500}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="mt-4 w-full accent-[var(--color-gold)]"
              />

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-[10px] bg-gold p-5 text-center">
                  <p className="font-heading text-3xl font-extrabold text-text-on-gold">
                    {money(perMonth)}
                  </p>
                  <p className="mt-1 text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-text-on-gold/70">
                    Per month
                  </p>
                </div>
                <div className="rounded-[10px] border border-border bg-background p-5 text-center">
                  <p className="font-heading text-3xl font-extrabold text-text-primary">
                    {money(perYear)}
                  </p>
                  <p className="mt-1 text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-text-muted">
                    Per year
                  </p>
                </div>
              </div>

              <p className="mt-5 text-center text-xs leading-relaxed text-text-muted">
                An illustration at {commissionLabel} of net order value, not a
                projection. What you actually earn depends on your reach and how
                well it converts.
              </p>
            </div>
          </div>
        </section>

        <Section eyebrow="Getting started" title="How the program works" tinted>
          <div className="grid gap-5 lg:grid-cols-3">
            {STEPS.map(({ n, title, body }) => (
              <div
                key={n}
                className="rounded-[20px] border border-border bg-background p-7"
              >
                <span className="inline-flex items-center justify-center rounded-[10px] bg-surface-accent px-3 py-1.5 font-heading text-sm font-extrabold text-gold">
                  {n}
                </span>
                <h3 className="mt-5 font-heading text-base font-extrabold text-text-primary">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Why partner with us" title="What partners get">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-[20px] border border-border bg-surface p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-surface-accent">
                  <Icon className="h-5 w-5 text-gold" />
                </span>
                <h3 className="mt-5 font-heading text-base font-extrabold text-text-primary">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Rules */}
        <section className="bg-surface">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-heading font-bold uppercase tracking-[0.14em] text-gold">
                <span aria-hidden="true">— </span>Keeping it fair
              </p>
              <h2 className="mt-3 font-heading text-2xl font-extrabold text-text-primary sm:text-3xl">
                Program rules
              </h2>
              <div className="mt-3 h-[3px] w-14 rounded-full bg-gold" />
              <p className="mt-5 text-sm leading-relaxed text-text-secondary">
                These exist so commission goes to partners who actually bring
                someone new, rather than to whoever intercepted a buyer at the
                last moment. Breaching them forfeits the commission on the
                affected orders and can end the partnership.
              </p>
              <Link
                href="/affiliate-terms"
                className="mt-6 inline-block border-b border-gold pb-0.5 font-heading text-sm font-bold text-gold hover:border-gold-hover hover:text-gold-hover"
              >
                Read the full terms →
              </Link>
            </div>

            <div className="space-y-3">
              {RULES.map(({ title, body }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-[20px] border border-border bg-background p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger/10">
                    <X className="h-4 w-4 text-danger" />
                  </span>
                  <div>
                    <h3 className="font-heading text-sm font-extrabold text-text-primary">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketing guidelines */}
        <Section eyebrow="Best practice" title="Marketing guidelines">
          <div className="rounded-[20px] border border-danger/40 bg-danger/5 p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-danger/10">
                <ShieldCheck className="h-5 w-5 text-danger" />
              </span>
              <div>
                <span className="inline-block rounded-full bg-danger px-2.5 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-white">
                  Read first
                </span>
                <h3 className="mt-3 font-heading text-base font-extrabold text-text-primary">
                  For research purposes only, not for human consumption
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Do not describe using our products yourself, and do not relay
                  anyone else&apos;s account of using them. That includes
                  framing it as your own experience or knowledge — a testimonial
                  is still a claim, and because we pay you it becomes our claim.
                  Everything we supply is for laboratory research only.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  Talk about the supplier instead of the substance:
                  certificates, testing, lot matching, purity exactly as
                  published, packaging, dispatch and price per milligram. That
                  is the material your audience cannot get elsewhere, and none
                  of it puts your account or ours at risk.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDELINES.map(({ icon: Icon, tag, title, body }) => (
              <div
                key={title}
                className="rounded-[20px] border border-border bg-surface p-7"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-surface-accent">
                  <Icon className="h-5 w-5 text-gold" />
                </span>
                <p className="mt-5 text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-gold">
                  {tag}
                </p>
                <h3 className="mt-2 font-heading text-base font-extrabold text-text-primary">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* FAQ */}
        <Section eyebrow="Good to know" title="Frequently asked questions" tinted>
          <div className="mx-auto max-w-2xl space-y-3">
            {FAQS.map(({ q, a }) => {
              const open = openFaq === q;
              return (
                <div
                  key={q}
                  className="overflow-hidden rounded-[20px] border border-border bg-background"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : q)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-heading text-sm font-extrabold text-text-primary">
                      {q}
                    </span>
                    {open ? (
                      <Minus className="h-4 w-4 shrink-0 text-gold" />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-gold" />
                    )}
                  </button>
                  {open && (
                    <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-text-secondary">
                      {a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Final CTA */}
        <section className="bg-background">
          <div className="mx-auto max-w-[1280px] px-4 pb-20">
            <div className="rounded-[20px] bg-gold p-10 text-center">
              <h2 className="font-heading text-2xl font-extrabold text-text-on-gold sm:text-3xl">
                Ready to apply?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-on-gold/80">
                Tell us where you publish and who reads you. Approval usually
                takes a business day, and we will send the content rules and
                asset library with your code.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-flex h-12 items-center rounded-[10px] bg-[#14110e] px-8 font-heading text-base font-bold text-gold transition-colors hover:bg-[#2a251e]"
              >
                Apply now
              </Link>
              <p className="mt-6 flex items-center justify-center gap-2 text-sm text-text-on-gold/80">
                <Mail className="h-4 w-4" />
                Questions? Reach us from the{" "}
                <Link href="/contact" className="font-bold underline">
                  contact page
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
