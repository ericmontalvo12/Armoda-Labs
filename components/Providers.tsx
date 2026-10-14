"use client";

import { CartProvider } from "@/lib/cart-context";
import { EmailPopup } from "@/components/EmailPopup";
import { ScrollToTop } from "@/components/ScrollToTop";
import { MetaPixel } from "@/components/MetaPixel";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <MetaPixel />
      <ScrollToTop />
      {children}
      <EmailPopup />
    </CartProvider>
  );
}
