"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { trackFbEvent } from "./fbpixel";
import { getPricePerBottle } from "./sale";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  smsConsent: boolean;
  setSmsConsent: (consent: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerEmail, setCustomerEmailState] = useState("");
  const [customerPhone, setCustomerPhoneState] = useState("");
  const [smsConsent, setSmsConsentState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart, email, phone, and SMS consent from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    const savedEmail = localStorage.getItem("customerEmail");
    if (savedEmail) {
      setCustomerEmailState(savedEmail);
    }
    const savedPhone = localStorage.getItem("customerPhone");
    if (savedPhone) {
      setCustomerPhoneState(savedPhone);
    }
    const savedSmsConsent = localStorage.getItem("smsConsent");
    if (savedSmsConsent) {
      setSmsConsentState(savedSmsConsent === "true");
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const setCustomerEmail = (email: string) => {
    setCustomerEmailState(email);
    if (email) {
      localStorage.setItem("customerEmail", email);
    }
  };

  const setCustomerPhone = (phone: string) => {
    setCustomerPhoneState(phone);
    localStorage.setItem("customerPhone", phone);
  };

  const setSmsConsent = (consent: boolean) => {
    setSmsConsentState(consent);
    localStorage.setItem("smsConsent", String(consent));
  };

  // Notify GHL of active cart contents for the abandoned-cart automation.
  // Only fires once per distinct cart + contact-info combination, and only
  // once we know the customer's email (from the discount popup or the cart page).
  useEffect(() => {
    if (!isLoaded || items.length === 0 || !EMAIL_REGEX.test(customerEmail)) return;
    // Phone is free-typed character by character; only treat it as settled
    // once it's empty or looks like a complete number, so every keystroke
    // doesn't produce a "new" signature and re-fire the webhook.
    const phoneDigits = customerPhone.replace(/\D/g, "");
    if (customerPhone !== "" && phoneDigits.length < 10) return;

    const signature = JSON.stringify({
      email: customerEmail,
      phone: customerPhone,
      smsConsent,
      items: items.map((item) => [item.id, item.quantity, item.price]),
    });
    if (localStorage.getItem("cartActivitySignature") === signature) return;
    localStorage.setItem("cartActivitySignature", signature);

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    fetch("/api/cart-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customerEmail,
        phone: customerPhone || undefined,
        smsConsent,
        cartItems: items,
        totalPrice,
      }),
    }).catch(() => {});
  }, [items, isLoaded, customerEmail, customerPhone, smsConsent]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: newQuantity, price: getPricePerBottle(newQuantity) }
            : i
        );
      }
      return [...prev, { ...item, quantity, price: getPricePerBottle(quantity) }];
    });

    // Several buttons on the product page add the same item (main CTA, mobile
    // sticky bar, final CTA), so collapse rapid repeat clicks. This used to
    // suppress a whole session per item+quantity, which swallowed roughly
    // three quarters of AddToCart events — the funnel showed fewer adds than
    // purchases. A short window catches double-clicks without dropping a
    // shopper who genuinely comes back and adds again.
    const DEDUP_MS = 10_000;
    let alreadyReported = false;
    try {
      const last = Number(sessionStorage.getItem("fbAddToCartAt") ?? 0);
      alreadyReported = Date.now() - last < DEDUP_MS;
      if (!alreadyReported) {
        sessionStorage.setItem("fbAddToCartAt", String(Date.now()));
      }
    } catch {
      // sessionStorage can throw in private mode; fall back to always sending.
    }

    if (!alreadyReported) {
      trackFbEvent("AddToCart", {
        content_name: item.name,
        content_ids: [item.id],
        content_type: "product",
        value: getPricePerBottle(quantity) * quantity,
        currency: "USD",
      });
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity, price: getPricePerBottle(quantity) }
          : item
      )
    );
  };

  // Stable across renders: /success clears the cart from an effect that lists
  // this in its dependencies, so a fresh function each render re-fired the
  // effect, which re-rendered the provider, and so on until React gave up.
  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("cartActivitySignature");
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        customerEmail,
        setCustomerEmail,
        customerPhone,
        setCustomerPhone,
        smsConsent,
        setSmsConsent,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
