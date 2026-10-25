"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
import type { Referral, ReferralEarnings } from "@/lib/customers-db";

const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export function ReferralPanel({
  approved,
  referral,
  earnings,
}: {
  approved: boolean;
  referral: Referral | null;
  earnings: ReferralEarnings | null;
}) {
  const [audience, setAudience] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/account/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not submit the application.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Could not submit the application.");
      setState("idle");
    }
  }

  // Approved referral: show the code and what it has earned.
  if (referral?.status === "approved" && referral.code) {
    return (
      <div className="rounded-[20px] border border-border bg-surface p-7">
        <h2 className="font-heading text-lg font-extrabold text-text-primary">
          Your referral code
        </h2>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(referral.code ?? "");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="mt-5 flex w-full items-center justify-between rounded-[10px] border-2 border-dashed border-gold bg-surface-elevated px-5 py-4 transition-colors hover:bg-surface-accent"
        >
          <span className="font-heading text-2xl font-extrabold tracking-widest text-gold">
            {referral.code}
          </span>
          <span className="flex items-center gap-2 text-sm text-text-muted">
            {copied ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>

        <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-border bg-border">
          {[
            ["Rate", `${referral.rateBps / 100}%`],
            ["Orders", String(earnings?.orderCount ?? 0)],
            ["Earned", money(earnings?.commissionCents ?? 0)],
          ].map(([label, value]) => (
            <div key={label} className="bg-surface p-4 text-center">
              <dt className="text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted">
                {label}
              </dt>
              <dd className="mt-1.5 font-heading text-lg font-extrabold text-text-primary">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 text-xs leading-relaxed text-text-muted">
          Commission is {referral.rateBps / 100}% of net order value on orders
          placed with your code, excluding refunded and cancelled orders. It is
          calculated from those orders each time this page loads, so it always
          reflects current order state.
        </p>

        <Link
          href="/affiliate-terms"
          className="mt-4 inline-block text-sm font-heading font-bold text-gold hover:underline"
        >
          Partner terms →
        </Link>
      </div>
    );
  }

  if (referral?.status === "pending" || state === "done") {
    return (
      <div className="rounded-[20px] border border-border bg-surface p-7">
        <h2 className="font-heading text-lg font-extrabold text-text-primary">
          Referral application under review
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          We review every application by hand. Once approved you will get a
          referral code here, and the dashboard will start tracking what it
          earns.
        </p>
      </div>
    );
  }

  if (referral?.status === "rejected") {
    return (
      <div className="rounded-[20px] border border-border bg-surface p-7">
        <h2 className="font-heading text-lg font-extrabold text-text-primary">
          Referral program
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          We are not able to approve a referral account for you at this time.{" "}
          <Link href="/contact" className="text-gold hover:underline">
            Get in touch
          </Link>{" "}
          if you think this is a mistake.
        </p>
      </div>
    );
  }

  // Account not yet approved — the referral review is the same review.
  if (!approved) {
    return (
      <div className="rounded-[20px] border border-border bg-surface p-7">
        <h2 className="font-heading text-lg font-extrabold text-text-primary">
          Referral program
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Opens once your account is approved. We review applications by hand,
          usually within two business days.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-border bg-surface p-7">
      <h2 className="font-heading text-lg font-extrabold text-text-primary">
        Apply to the referral program
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        Earn 20% of net order value on every order placed with your code.
        Tell us where you publish and who your audience is.
      </p>

      <form onSubmit={submit} className="mt-5">
        <label htmlFor="audience" className="sr-only">
          Where you publish and who your audience is
        </label>
        <textarea
          id="audience"
          required
          minLength={20}
          rows={4}
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="Where you publish, roughly how many people you reach, and the kind of content you make."
          className="w-full rounded-[10px] border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-gold"
        />

        <p className="mt-4 rounded-[10px] border border-danger/40 bg-danger/5 px-4 py-3 text-xs leading-relaxed text-text-secondary">
          Partner content must not describe use in a human or an animal, state
          a dose or protocol, or claim any outcome. Because we compensate you,
          what you publish counts as our advertising.{" "}
          <Link href="/affiliate-terms" target="_blank" className="text-gold hover:underline">
            Read the terms
          </Link>
        </p>

        <button
          type="submit"
          disabled={state === "sending"}
          className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-7 font-heading text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {state === "sending" ? "Submitting…" : "Apply"}
        </button>

        {error && <p className="mt-3 text-sm text-danger" role="alert">{error}</p>}
      </form>
    </div>
  );
}
