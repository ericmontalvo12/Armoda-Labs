"use client";

import dynamic from "next/dynamic";

/**
 * Stripe.js is ~200KB and EmbeddedCheckout calls loadStripe() at module
 * scope, so importing it statically pulls Stripe into the page bundle for
 * every visitor - including the ~95% who never open checkout. Loading it on
 * demand keeps it off the critical path.
 */
export const LazyCheckoutModal = dynamic(
  () => import("@/components/EmbeddedCheckout").then((m) => m.EmbeddedCheckoutModal),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[200] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 bg-white rounded-2xl px-6 py-5 shadow-2xl">
          <p className="text-sm text-gray-600">Loading secure checkout…</p>
        </div>
      </div>
    ),
  }
);
