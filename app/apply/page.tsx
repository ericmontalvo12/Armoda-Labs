"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MINIMUM_AGE } from "@/lib/buyer-acknowledgement";

/**
 * Account registration.
 *
 * Creates the account immediately in `pending` status rather than emailing an
 * application and creating it later. The person gets credentials that work,
 * sees their own order history straight away, and the only thing approval
 * gates is the referral program — which keeps the review meaningful without
 * making a stranger wait to see orders they have already placed.
 *
 * The certification is enforced server-side as well, since it is a condition
 * of holding an account rather than a form nicety.
 */
export default function ApplyPage() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [certified, setCertified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!certified) return;
    setState("sending");
    setError(null);
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();

    try {
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: get("email"),
          password: get("password"),
          name: get("name"),
          organization: get("organization"),
          role: get("role"),
          researchUse: get("use"),
          expectedVolume: get("volume"),
          certified: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create the account.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setState("error");
    }
  }

  const field =
    "w-full rounded-[10px] border border-border bg-surface px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-gold";
  const label =
    "mb-1.5 block text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted";

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top pb-20">
        <div className="mx-auto max-w-2xl px-4">
          <p className="text-xs font-heading font-bold uppercase tracking-[0.18em] text-gold">
            <span aria-hidden="true">— </span>Account application
          </p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
            Create an account
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Accounts are reviewed individually. Tell us who you are and what
            the material is for, and we will come back to you within two
            business days.
          </p>

          {state === "done" ? (
            <div className="mt-10 rounded-[20px] border border-border bg-surface p-8 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-accent">
                <Check className="h-5 w-5 text-gold" />
              </span>
              <h2 className="mt-5 font-heading text-lg font-extrabold text-text-primary">
                Account created
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
                You can sign in now and see your orders. We review every
                application by hand. Approval unlocks the referral program,
                and usually takes two business days.
              </p>
              <Link
                href="/account/login"
                className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 font-heading text-sm font-bold text-on-primary transition-colors hover:bg-primary-hover"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={label}>Full name</label>
                  <input id="name" name="name" required className={field} />
                </div>
                <div>
                  <label htmlFor="email" className={label}>Email</label>
                  <input id="email" name="email" type="email" required className={field} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="organization" className={label}>Organization</label>
                  <input id="organization" name="organization" className={field} />
                </div>
                <div>
                  <label htmlFor="role" className={label}>Role</label>
                  <input id="role" name="role" className={field} />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={label}>Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={10}
                  autoComplete="new-password"
                  className={field}
                />
                <p className="mt-1.5 text-xs text-text-muted">
                  At least 10 characters.
                </p>
              </div>

              <div>
                <label htmlFor="use" className={label}>Intended research use</label>
                <textarea id="use" name="use" rows={3} className={field} />
              </div>

              <div>
                <label htmlFor="volume" className={label}>Expected volume</label>
                <input id="volume" name="volume" className={field} />
              </div>

              <div className="rounded-[10px] border border-border bg-surface p-4">
                <label htmlFor="certify" className="flex cursor-pointer items-start gap-3">
                  <input
                    id="certify"
                    type="checkbox"
                    required
                    checked={certified}
                    onChange={(e) => setCertified(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-gold)]"
                  />
                  <span className="text-xs leading-relaxed text-text-secondary">
                    I certify that I am at least {MINIMUM_AGE} years of age,
                    that I am qualified by training or experience to handle
                    research chemicals, and that material will be used for
                    laboratory research only. Never consumed or administered
                    to any human or animal.{" "}
                    <Link href="/terms-of-service" target="_blank" className="text-gold hover:underline">
                      Terms of Service
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={state === "sending" || !certified}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-8 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {state === "sending" ? "Sending…" : "Submit application"}
              </button>

              {error && (
                <p className="text-sm text-danger" role="alert">{error}</p>
              )}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
