"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type NavLink = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const navLinks: NavLink[] = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Articles" },
  { href: "/how-to-pay", label: "How to Pay" },
  {
    href: "/wholesale",
    label: "Affiliate/Wholesale",
    children: [
      { href: "/wholesale", label: "Wholesale" },
      { href: "/affiliate", label: "Affiliate Program" },
      { href: "/affiliate/login", label: "Affiliate Login" },
    ],
  },
  { href: "/help", label: "Help" },
  { href: "/account/login", label: "Account" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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
        className={`announceBar bg-gold text-center transition-all duration-300 ease-in-out overflow-hidden ${showAnnouncement ? "h-9 flex items-center justify-center px-4" : "h-0"}`}
      >
        <p className="hidden sm:block text-sm font-heading font-bold text-text-on-gold whitespace-nowrap tracking-wide">
          THIRD-PARTY TESTED
          <span className="mx-2 opacity-60">|</span> COA PUBLISHED FOR EVERY LOT
          <span className="mx-2 opacity-60">|</span> SAME-DAY WEEKDAY DISPATCH
        </p>
        <div className="sm:hidden announceTrack">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="flex-shrink-0 text-xs font-heading font-bold text-text-on-gold whitespace-nowrap tracking-wide"
            >
              THIRD-PARTY TESTED
              <span className="mx-3 opacity-60">&bull;</span> COA EVERY LOT
              <span className="mx-3 opacity-60">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex h-[72px] items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="font-heading text-xl font-extrabold tracking-tight text-text-primary">
                ARMODA<span className="text-gold">LABS</span>
              </span>
            </Link>

            <nav className="flex items-center gap-8">
              {navLinks.map((link) =>
                link.children ? (
                  // Opens on hover for pointers and on focus for keyboards, so
                  // the submenu is reachable without a click either way.
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    onFocus={() => setOpenDropdown(link.href)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setOpenDropdown(null);
                      }
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={openDropdown === link.href}
                      aria-haspopup="true"
                      onClick={() =>
                        setOpenDropdown((cur) =>
                          cur === link.href ? null : link.href
                        )
                      }
                      className="flex items-center gap-1 text-sm font-heading font-bold text-text-primary uppercase tracking-wide hover:text-gold-text transition-colors"
                    >
                      {link.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          openDropdown === link.href ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openDropdown === link.href && (
                      <div className="absolute left-0 top-full z-50 w-56 pt-3">
                        <ul className="overflow-hidden rounded-[10px] border border-border bg-surface py-2">
                          {link.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setOpenDropdown(null)}
                                className="block px-4 py-2.5 text-sm font-heading font-bold text-text-secondary transition-colors hover:bg-surface-accent hover:text-gold-text"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-heading font-bold text-text-primary uppercase tracking-wide hover:text-gold-text transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative">
                <button
                  aria-label="Cart"
                  className="p-2 text-text-primary hover:text-gold-text transition-colors cursor-pointer"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold text-text-on-gold text-xs font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center h-10 px-6 rounded-[10px] bg-gold text-text-on-gold font-heading font-bold text-sm hover:bg-gold-hover transition-colors"
              >
                Shop
              </Link>
            </div>
          </div>

          {/* Mobile Layout — matches Bucked Up: 55px top + 45px logo = ~100px total */}
          <div className="md:hidden grid grid-cols-3 items-center h-[64px]">
            <div className="justify-self-start">
              <button
                className="p-2 text-text-primary hover:text-gold-text transition-colors"
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
                <span className="font-heading text-base font-extrabold tracking-tight text-text-primary">
                  ARMODA<span className="text-gold">LABS</span>
                </span>
              </Link>
            </div>

            <div className="justify-self-end flex items-center gap-2">
              <Link href="/cart" className="relative p-2 block">
                <ShoppingCart className="h-5 w-5 text-text-primary" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-gold text-text-on-gold text-xs font-bold rounded-full flex items-center justify-center">
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
            className="md:hidden bg-surface border-b border-border"
          >
            <nav className="flex flex-col px-4 py-3">
              {navLinks.map((link) =>
                link.children ? (
                  // Mobile has no hover, so the group renders expanded rather
                  // than behind a second tap.
                  <div
                    key={link.href}
                    className="border-b border-border-subtle py-3 last:border-b-0"
                  >
                    <p className="font-heading text-sm font-bold uppercase tracking-wide text-text-muted">
                      {link.label}
                    </p>
                    <ul className="mt-2 space-y-1 pl-3">
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 font-heading text-sm font-bold text-text-primary transition-colors hover:text-gold-text"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-3 font-heading font-bold text-text-primary uppercase text-sm tracking-wide hover:text-gold-text transition-colors border-b border-border-subtle last:border-b-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-4">
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full h-11 rounded-[10px] bg-gold text-text-on-gold font-heading font-bold text-base hover:bg-gold-hover transition-colors"
                >
                  Shop
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
