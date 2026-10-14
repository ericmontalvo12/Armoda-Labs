"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";
import { trackFbEvent } from "@/lib/fbpixel";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState<string | null>(null);

  // Read straight from storage rather than the cart context: effects run
  // child-before-parent, so on the first commit the provider hasn't loaded
  // localStorage yet and its items are still empty. This runs during render,
  // before the clear effect below wipes the key.
  const [cartSnapshot] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) return null;
      const total = (JSON.parse(raw) as CartItem[]).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return total > 0 ? total : null;
    } catch {
      return null;
    }
  });

  // Clear the cart after successful purchase
  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  // Check if this was a subscription and fetch portal URL
  useEffect(() => {
    if (!sessionId) return;
    fetch("/api/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.isSubscription && data.url) setPortalUrl(data.url);
      })
      .catch(() => {});
  }, [sessionId]);

  // The order row is created by the Stripe webhook, which can land a moment
  // after this page does — retry briefly before falling back to a session code.
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let attempts = 0;

    const poll = () => {
      fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.orderNumber) {
            setOrderRef(data.orderNumber);
          } else if (++attempts < 4) {
            setTimeout(poll, 1500);
          } else {
            setOrderRef(sessionId.slice(-8).toUpperCase());
          }
        })
        .catch(() => {
          if (!cancelled) setOrderRef(sessionId.slice(-8).toUpperCase());
        });
    };
    poll();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // Fire the Meta Pixel Purchase event once per session ID, so refreshing
  // this page doesn't double-count the conversion.
  useEffect(() => {
    if (!sessionId) return;
    const trackedKey = `fbPurchaseTracked:${sessionId}`;
    try {
      if (localStorage.getItem(trackedKey)) return;
    } catch {
      // Private mode can throw; fall through and send the event.
    }

    let sent = false;
    // The event id is the Stripe session, the same one the webhook gives the
    // Conversions API, so Meta dedupes the pair however this fires.
    const send = (value: number, currency: string) => {
      if (sent) return;
      sent = true;
      trackFbEvent("Purchase", { value, currency }, sessionId);
      try {
        localStorage.setItem(trackedKey, "true");
      } catch {
        // Not fatal - the server copy shares the event id and dedupes.
      }
    };

    // Most buyers arrive here in the Instagram or Facebook in-app browser and
    // some close the tab within a second, so the amount lookup must not be the
    // only path to the event. The cart total is an approximation (it predates
    // any promo code or shipping), so it only goes out if the authoritative
    // amount is slow to arrive.
    const fallback =
      cartSnapshot != null
        ? setTimeout(() => send(cartSnapshot, "USD"), 1200)
        : undefined;

    fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.amountTotal != null) {
          clearTimeout(fallback);
          send(data.amountTotal, (data.currency || "usd").toUpperCase());
        }
      })
      .catch(() => {});

    return () => clearTimeout(fallback);
  }, [sessionId, cartSnapshot]);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-surface/50">
      <Header />
      <main className="pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Order Confirmed!
            </h1>

            <p className="text-text-secondary mb-2">
              Thanks for your order. It's in stock and will ship shortly.
            </p>

            {orderRef && (
              <p className="text-text-muted text-sm mb-8">
                Order number:{" "}
                <code className="bg-surface px-2 py-1 rounded font-semibold text-text-primary">
                  {orderRef}
                </code>
              </p>
            )}

            <div className="bg-white border border-border rounded-lg p-6 mb-8 text-left">
              <h2 className="font-heading font-semibold text-text-primary mb-4">
                What happens next?
              </h2>
              <ul className="space-y-3 text-text-secondary text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>You'll receive an order confirmation email shortly.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Your order will ship within 1-2 business days.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    We'll send you tracking information the moment your order ships.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Your 30-day guarantee starts when your order arrives.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className={buttonVariants({ size: "lg" })}>
                Return Home
              </Link>
              {portalUrl ? (
                <a href={portalUrl} className={buttonVariants({ size: "lg", variant: "outline" })}>
                  Manage Subscription
                </a>
              ) : (
                <Link href="/product" className={buttonVariants({ size: "lg", variant: "outline" })}>
                  View Product
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="pt-32 px-6">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
