"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LazyCheckoutModal } from "@/components/LazyCheckoutModal";
import { trackFbEvent } from "@/lib/fbpixel";
import { BuyerAcknowledgement } from "@/components/BuyerAcknowledgement";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutButtonProps {
  cartItems: CartItem[];
  className?: string;
  disabled?: boolean;
  promotionCodeId?: string;
  email?: string;
}

export function CheckoutButton({ cartItems, className, disabled, promotionCodeId, email }: CheckoutButtonProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleOpenCheckout = () => {
    if (!acknowledged) return;
    trackFbEvent("InitiateCheckout", {
      value: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      currency: "USD",
      num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      content_type: "product",
    });
    setShowCheckout(true);
  };

  return (
    <>
      <div className="mb-3">
        <BuyerAcknowledgement
          checked={acknowledged}
          onChange={setAcknowledged}
        />
      </div>

      <Button
        size="lg"
        className={className || "w-full"}
        onClick={handleOpenCheckout}
        // Gated on the action rather than only shown beside it: an
        // unchecked box must make checkout unreachable, not merely visible.
        disabled={disabled || cartItems.length === 0 || !acknowledged}
      >
        Complete Purchase
      </Button>

      {showCheckout && acknowledged && (
        <LazyCheckoutModal
          cartItems={cartItems}
          promotionCodeId={promotionCodeId}
          email={email}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  );
}
