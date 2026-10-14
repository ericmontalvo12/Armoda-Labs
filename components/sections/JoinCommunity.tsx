"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

const EMAIL_SUBSCRIBE_API = "/api/email-subscribe";

export function JoinCommunity() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setCustomerEmail } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      setCustomerEmail(email);
      localStorage.setItem("promoCode", "WELCOME10");
      await fetch(EMAIL_SUBSCRIBE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // non-blocking
    }
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
            Join the Community
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-8">
            Get exclusive deals, training tips, and early access to new products. Plus, get 10% off your first order.
          </p>

          {submitted ? (
            <div className="bg-white/10 rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 text-white mb-2">
                <Check className="w-5 h-5 text-success" />
                <span className="font-heading font-bold">You&apos;re in!</span>
              </div>
              <p className="text-white/70 text-sm">
                Use code <span className="font-bold text-white">WELCOME10</span> for 10% off your first order.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-[5px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                type="submit"
                disabled={loading}
                className="px-8 whitespace-nowrap"
              >
                {loading ? "Joining..." : "Get 10% Off"}
              </Button>
            </form>
          )}

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-6 text-xs text-white/50">
            <span>No spam, ever</span>
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
