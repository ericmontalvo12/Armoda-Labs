"use client";

import { useState } from "react";

export function ResendVerification() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "unavailable">(
    "idle"
  );

  async function resend() {
    setState("sending");
    try {
      const res = await fetch("/api/account/verify", { method: "POST" });
      const data = await res.json();
      // `sent: false` means no mail route is configured, which is different
      // from a failure and should not read as "check your inbox".
      setState(res.ok && data.sent ? "sent" : "unavailable");
    } catch {
      setState("unavailable");
    }
  }

  if (state === "sent") {
    return (
      <p className="mt-3 text-sm text-text-secondary">
        Sent. The link is good for 7 days.
      </p>
    );
  }

  if (state === "unavailable") {
    return (
      <p className="mt-3 text-sm text-text-secondary">
        We could not send it automatically. Contact us and we will confirm
        your address by hand.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={resend}
      disabled={state === "sending"}
      className="mt-3 text-sm font-heading font-bold text-gold-text hover:underline disabled:opacity-60"
    >
      {state === "sending" ? "Sending…" : "Send the link again"}
    </button>
  );
}
