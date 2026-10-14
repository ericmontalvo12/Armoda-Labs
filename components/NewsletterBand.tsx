"use client";

import { useState } from "react";

/**
 * Sits directly above the footer on every page. The reference headlines this
 * with "85% of users stay up to date with our newsletter" — a statistic we
 * have no basis for, so it is not reproduced.
 */
export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/email-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="border-y border-border bg-surface-elevated">
      <div className="mx-auto max-w-[1280px] px-4 py-14 text-center">
        <p className="text-xs font-heading font-bold uppercase tracking-[0.18em] text-gold">
          Stay informed
        </p>
        <h2 className="mx-auto mt-3 max-w-xl font-heading text-2xl font-extrabold text-text-primary sm:text-3xl">
          New lots, certificates and catalog updates
        </h2>

        {state === "done" ? (
          <p className="mt-6 text-sm text-text-secondary" role="status">
            Thanks — you&apos;re on the list.
          </p>
        ) : (
          <form
            onSubmit={submit}
            className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-12 flex-1 rounded-[10px] border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-gold"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="inline-flex h-12 items-center justify-center rounded-[10px] bg-primary px-7 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {state === "sending" ? "Signing up…" : "Sign up"}
            </button>
          </form>
        )}

        {state === "error" && (
          <p className="mt-3 text-sm text-danger" role="alert">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
