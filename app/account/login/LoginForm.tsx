"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not sign you in.");
        setState("idle");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Could not sign you in. Please try again.");
      setState("idle");
    }
  }

  const field =
    "w-full rounded-[10px] border border-border bg-surface px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-gold";
  const label =
    "mb-1.5 block text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted";

  return (
    <>
          <h1 className="font-heading text-3xl font-extrabold text-text-primary">
            Sign in
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Access your orders and referral dashboard.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className={label}>Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" className={field} />
            </div>
            <div>
              <label htmlFor="password" className={label}>Password</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" className={field} />
            </div>

            <button
              type="submit"
              disabled={state === "sending"}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-8 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {state === "sending" ? "Signing in…" : "Sign in"}
            </button>

            {error && (
              <p className="text-sm text-danger" role="alert">{error}</p>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            No account?{" "}
            <Link href="/apply" className="font-heading font-bold text-gold hover:underline">
              Apply for one
            </Link>
          </p>
    </>
  );
}
