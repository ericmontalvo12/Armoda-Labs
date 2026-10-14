"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LazyCheckoutModal } from "@/components/LazyCheckoutModal";
import { trackFbEvent } from "@/lib/fbpixel";

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

  const handleOpenCheckout = () => {
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
      <Button
        size="lg"
        className={className || "w-full"}
        onClick={handleOpenCheckout}
        disabled={disabled || cartItems.length === 0}
      >
        Complete Purchase
      </Button>

      {showCheckout && (
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
