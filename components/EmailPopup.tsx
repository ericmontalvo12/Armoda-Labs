"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

const SEEN_KEY = "emailPopupSeen";
const SUPPRESSED_PATHS = ["/cart", "/success", "/manage"];
const MOBILE_SCROLL_DEPTH = 0.6;
const MOBILE_DWELL_MS = 25000;

export function EmailPopup() {
  const { setCustomerEmail } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (SUPPRESSED_PATHS.some((p) => pathname?.startsWith(p))) return;
    if (localStorage.getItem(SEEN_KEY)) return;

    let done = false;
    const open = () => {
      if (done) return;
      done = true;
      localStorage.setItem(SEEN_KEY, "1");
      setIsOpen(true);
      cleanup();
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) open();
    };

    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= MOBILE_SCROLL_DEPTH) open();
    };

    const isTouch = window.matchMedia("(hover: none)").matches;
    let dwellTimer: ReturnType<typeof setTimeout> | undefined;

    if (isTouch) {
      window.addEventListener("scroll", onScroll, { passive: true });
      dwellTimer = setTimeout(open, MOBILE_DWELL_MS);
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }

    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
      if (dwellTimer) clearTimeout(dwellTimer);
    }
    return cleanup;
  }, [pathname]);

  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem("promoCode", "WELCOME10");
      setCustomerEmail(email);
      setIsSubmitted(true);
      try {
        await fetch("/api/email-subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch {
        // non-blocking
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("WELCOME10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
        >
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors rounded-full hover:bg-surface z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md px-8 text-center"
          >
            {!isSubmitted ? (
              <>
                <div className="mb-8 flex justify-center">
                  <Image
                    src="/logo-new.png"
                    alt="Rock Mountain Performance"
                    width={180}
                    height={54}
                    className="h-10 w-auto"
                  />
                </div>

                <p className="text-[11px] font-heading font-bold uppercase tracking-widest text-primary mb-3">
                  Limited Time Offer
                </p>
                <h2 className="font-heading text-[32px] font-bold text-text-primary leading-tight mb-3">
                  Get 10% Off<br />Your First Order
                </h2>
                <p className="text-sm text-text-muted mb-8 leading-relaxed">
                  Peak Performance is in stock now. Enter your email to claim your code and get your first bottle.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full h-14 px-4 rounded-[5px] border border-border bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base"
                  />
                  <Button type="submit" size="lg" className="w-full h-14 text-base">
                    Claim My 10% Code
                  </Button>
                </form>

                <button
                  onClick={handleClose}
                  className="mt-5 text-sm text-text-muted hover:text-text-secondary transition-colors w-full text-center"
                >
                  No thanks, I&apos;ll pay full price
                </button>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-5">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-2">
                  Here&apos;s your code!
                </h2>
                <p className="text-sm text-text-muted mb-6">
                  Apply it at checkout for 10% off your first order.
                </p>
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-[5px] border-2 border-dashed border-primary bg-primary/5 hover:bg-primary/10 transition-colors group mb-4"
                >
                  <span className="font-heading text-2xl font-bold text-primary tracking-widest">
                    WELCOME10
                  </span>
                  <span className="text-sm text-primary/70 group-hover:text-primary transition-colors ml-3">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </button>
                <Button size="lg" className="w-full h-12" onClick={handleClose}>
                  Shop Now
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
