"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * The hero's two buttons, which depend on whether anyone is signed in.
 *
 * Offering "Login / Apply for account" to someone already signed in is the
 * same mistake the header made: it reads as having been logged out. The
 * hint cookie is a display name only, so the worst a forged one does is
 * show the wrong pair of buttons.
 */
export function HeroActions() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setSignedIn(
      document.cookie.split("; ").some((row) => row.startsWith("armoda_account="))
    );
  }, []);

  // The two labels are different lengths, so sizing each to its own text
  // made them visibly unequal. basis-0 + grow gives both the same width on a
  // row, and they go full width when they stack.
  const base =
    "inline-flex h-12 w-full items-center justify-center rounded-full px-8 font-heading text-base font-bold transition-colors sm:w-auto sm:flex-1 sm:basis-0";
  const secondary = `${base} border border-border text-text-primary hover:border-gold hover:text-gold`;
  const primary = `${base} bg-primary text-on-primary hover:bg-primary-hover`;

  // Until the cookie has been read, render the signed-out pair. It is the
  // right answer for most visitors and avoids a flash of empty space.
  if (signedIn) {
    return (
      <div className="mt-9 flex max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <Link href="/products" className={primary}>
          Shop the catalog
        </Link>
        <Link href="/account" className={secondary}>
          Your account
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-9 flex max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <Link href="/products" className={primary}>
        Shop the catalog
      </Link>
      <Link href="/apply" className={secondary}>
        Apply for an account
      </Link>
    </div>
  );
}
