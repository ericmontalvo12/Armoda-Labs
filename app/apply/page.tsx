"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MINIMUM_AGE } from "@/lib/buyer-acknowledgement";

/**
 * Account application.
 *
 * There is no authentication system yet, so this does not create an account —
 * it collects the information a qualified-buyer review would need and sends
 * it through the existing contact route. That is the honest version of the
 * reference's "Apply for account", and it is useful on its own: a record of
 * who asked, what they do, and what they certified.
 *
 * When accounts are built, this form becomes their registration step rather
 * than being replaced — see TODO.md.
 */
export default function ApplyPage() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [certified, setCertified] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!certified) return;
    setState("sending");
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          email: get("email"),
          subject: "Account application",
          message: [
            `Organization: ${get("organization") || "—"}`,
            `Role: ${get("role") || "—"}`,
            `Intended research use: ${get("use") || "—"}`,
            `Expected volume: ${get("volume") || "—"}`,
            ``,
            `Certified: ${MINIMUM_AGE}+, acquiring for laboratory research only,`,
            `qualified to handle research chemicals, not for human or animal use.`,
          ].join("\n"),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
    } catch {
      setState("error");
    }
  }

  const field =
    "w-full rounded-[10px] border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-gold";
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
            Apply for an account
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
                Application received
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
                We review every application by hand. You will hear from us
                within two business days.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex h-11 items-center rounded-full border border-border px-6 font-heading text-sm font-bold text-text-primary transition-colors hover:border-gold hover:text-gold"
              >
                Browse the catalog
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
                    laboratory research only — never consumed or administered
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

              {state === "error" && (
                <p className="text-sm text-danger" role="alert">
                  Something went wrong. Please try again, or contact us
                  directly.
                </p>
              )}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
