"use client";

import { useCallback, useState } from "react";
import {
  loadStripe,
  type StripeEmbeddedCheckoutOptions,
} from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout as StripeEmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { X } from "lucide-react";
import { readCookie } from "@/lib/fbpixel";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  isSubscription?: boolean;
  subscriptionIntervalCount?: number;
}

interface EmbeddedCheckoutModalProps {
  cartItems: CartItem[];
  promotionCodeId?: string;
  email?: string;
  onClose: () => void;
}

export function EmbeddedCheckoutModal({
  cartItems,
  promotionCodeId,
  email,
  onClose,
}: EmbeddedCheckoutModalProps) {
  const fetchClientSecret = useCallback(async () => {
    // Meta's browser cookies are the strongest ad-attribution signal, and the
    // Stripe webhook has no browser context. Capture them here and carry them
    // through the session so the server-side Purchase event can include them.
    const res = await fetch("/api/checkout-embedded", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems,
        promotionCodeId,
        email,
        fbp: readCookie("_fbp"),
        fbc: readCookie("_fbc"),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to start checkout");
    return data.clientSecret as string;
  }, [cartItems, promotionCodeId, email]);

  const options: StripeEmbeddedCheckoutOptions = { fetchClientSecret };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <span className="font-semibold text-gray-900">Secure Checkout</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Embedded Checkout Form */}
        <div className="overflow-y-auto flex-1">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <StripeEmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}
