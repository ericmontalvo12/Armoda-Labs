"use client";

import { useState } from "react";

/**
 * Replaces a decorative bar chart whose heights were invented.
 *
 * Bars that look like data and are not are the weakest thing a page like
 * this can carry, and they were the most borrowed part of the layout. A
 * calculator answers the same question honestly: the person supplies the
 * numbers, so nothing here is a claim about what anyone earns.
 */
export function CommissionCalculator({ rateBps }: { rateBps: number }) {
  const [orderValue, setOrderValue] = useState(150);
  const [ordersPerMonth, setOrdersPerMonth] = useState(10);

  const rate = rateBps / 10_000;
  const monthly = orderValue * ordersPerMonth * rate;

  const money = (n: number) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const field =
    "h-12 w-full rounded-control border border-border bg-background px-4 text-text-primary outline-none transition-colors focus:border-gold";

  return (
    <div className="rounded-[20px] border border-border bg-surface p-7">
      <p className="text-xs font-heading font-bold uppercase tracking-wider text-text-muted">
        Work out your own number
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-text-muted">
            Average order value
          </span>
          <input
            type="number"
            min={0}
            max={10000}
            value={orderValue}
            onChange={(e) => setOrderValue(Math.max(0, Number(e.target.value)))}
            className={field}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-text-muted">
            Referred orders a month
          </span>
          <input
            type="number"
            min={0}
            max={10000}
            value={ordersPerMonth}
            onChange={(e) =>
              setOrdersPerMonth(Math.max(0, Number(e.target.value)))
            }
            className={field}
          />
        </label>
      </div>

      <div className="mt-7 border-t border-border pt-6">
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-text-muted">
          At {(rate * 100).toFixed(0)}%, that is
        </p>
        <p className="mt-2 font-heading text-4xl font-extrabold text-gold-text">
          {money(monthly)}
          <span className="ml-2 align-middle text-base font-bold text-text-secondary">
            a month
          </span>
        </p>
        <p className="mt-4 text-xs leading-relaxed text-text-muted">
          Your figures, not ours. Commission is paid on net order value and is
          recalculated when an order is refunded or cancelled, so this is what
          sticks rather than what was ordered.
        </p>
      </div>
    </div>
  );
}
