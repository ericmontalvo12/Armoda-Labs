"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function GateForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/site-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password.");
        return;
      }
      // The cookie is set on the response, so a refresh is enough for
      // middleware to let the next request through.
      const next = params.get("next");
      router.replace(next && next.startsWith("/") ? next : "/");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-3">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        required
        aria-label="Access password"
        className="h-12 w-full rounded-control border border-border bg-surface px-4 text-text-primary outline-none focus:border-gold"
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="h-12 w-full rounded-control bg-primary font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-60"
      >
        {sending ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
