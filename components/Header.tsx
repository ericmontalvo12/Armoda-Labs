"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { isSaleActive } from "@/lib/sale";
import { SaleCountdown } from "@/components/SaleCountdown";

const navLinks = [
  { href: "/product", label: "Shop" },
  { href: "/formula", label: "Ingredients" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Articles" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setShowAnnouncement(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar */}
      <div
        className={`announceBar bg-primary text-center transition-all duration-300 ease-in-out overflow-hidden ${showAnnouncement ? "h-9 flex items-center justify-center px-4" : "h-0"}`}
      >
        <p className="hidden sm:block text-sm font-heading font-bold text-white whitespace-nowrap tracking-wide">
          {isSaleActive() ? (
            <>
              20% OFF &mdash; $39.95/BOTTLE{" "}
              <span className="mx-2 opacity-60">|</span> FREE SHIPPING ON
              ORDERS $100+{" "}
              <span className="mx-2 opacity-60">|</span> ENDS IN{" "}
              <SaleCountdown className="font-bold" />
            </>
          ) : (
            <>
              FREE SHIPPING{" "}
              <span className="mx-2 opacity-60">|</span> 30-DAY MONEY BACK
              GUARANTEE
            </>
          )}
        </p>
        <div className="sm:hidden announceTrack">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="flex-shrink-0 text-xs font-heading font-bold text-white whitespace-nowrap tracking-wide"
            >
              {isSaleActive() ? (
                <>
                  20% OFF &mdash; $39.95/BOTTLE{" "}
                  <span className="mx-3 opacity-60">&bull;</span> ENDS IN{" "}
                  <SaleCountdown />{" "}
                  <span className="mx-3 opacity-60">&bull;</span>
                </>
              ) : (
                <>
                  FREE SHIPPING{" "}
                  <span className="mx-3 opacity-60">&bull;</span> 30-DAY
                  GUARANTEE{" "}
                  <span className="mx-3 opacity-60">&bull;</span>
                </>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex h-[72px] items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-new.png"
                alt="Rock Mountain Performance"
                width={180}
                height={54}
                className="h-10 w-auto"
                priority
              />
            </Link>

            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-heading font-bold text-secondary uppercase tracking-wide hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative">
                <button
                  aria-label="Cart"
                  className="p-2 text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>
              <Link
                href="/product"
                className="inline-flex items-center justify-center h-10 px-6 rounded-[5px] bg-primary text-white font-heading font-bold text-sm hover:bg-primary-hover transition-colors"
              >
                Buy Now
              </Link>
            </div>
          </div>

          {/* Mobile Layout — matches Bucked Up: 55px top + 45px logo = ~100px total */}
          <div className="md:hidden grid grid-cols-3 items-center h-[64px]">
            <div className="justify-self-start">
              <button
                className="p-2 text-secondary hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            <div className="justify-self-center">
              <Link href="/" className="block">
                <Image
                  src="/logo-new.png"
                  alt="Rock Mountain Performance"
                  width={160}
                  height={48}
                  className="h-9 w-auto"
                  priority
                />
              </Link>
            </div>

            <div className="justify-self-end flex items-center gap-2">
              <Link href="/cart" className="relative p-2 block">
                <ShoppingCart className="h-5 w-5 text-secondary" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-border"
          >
            <nav className="flex flex-col px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 font-heading font-bold text-secondary uppercase text-sm tracking-wide hover:text-primary transition-colors border-b border-border-subtle last:border-b-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  href="/product"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full h-11 rounded-[5px] bg-primary text-white font-heading font-bold text-base hover:bg-primary-hover transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
