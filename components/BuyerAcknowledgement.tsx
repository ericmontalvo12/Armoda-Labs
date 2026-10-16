"use client";

import Link from "next/link";
import { ACK_TEXT } from "@/lib/buyer-acknowledgement";

/**
 * Required checkbox gating checkout. Rendered as a controlled input so the
 * parent owns the state and can disable its own checkout button — the gate
 * has to be on the action, not just visually adjacent to it.
 */
export function BuyerAcknowledgement({
  checked,
  onChange,
  id = "buyer-ack",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  id?: string;
}) {
  return (
    <div className="rounded-[10px] border border-border bg-surface p-4">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-gold)]"
        />
        <span className="text-xs leading-relaxed text-text-secondary">
          {ACK_TEXT}{" "}
          <Link
            href="/terms-of-service"
            className="text-gold hover:underline"
            target="_blank"
          >
            Terms of Service
          </Link>
        </span>
      </label>
    </div>
  );
}
