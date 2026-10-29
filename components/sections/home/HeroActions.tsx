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

  const secondary =
    "inline-flex h-12 items-center rounded-full border border-border px-8 font-heading text-base font-bold text-text-primary transition-colors hover:border-gold hover:text-gold";
  const primary =
    "inline-flex h-12 items-center rounded-full bg-primary px-8 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover";

  // Until the cookie has been read, render the signed-out pair. It is the
  // right answer for most visitors and avoids a flash of empty space.
  if (signedIn) {
    return (
      <div className="mt-9 flex flex-wrap items-center gap-3">
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
    <div className="mt-9 flex flex-wrap items-center gap-3">
      <Link href="/products" className={primary}>
        Shop the catalog
      </Link>
      <Link href="/apply" className={secondary}>
        Apply for an account
      </Link>
    </div>
  );
}
