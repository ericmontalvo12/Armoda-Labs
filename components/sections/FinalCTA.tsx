"use client";

import Image from "next/image";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-14 sm:py-20 bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white mb-3">
            Ready to Feel the Difference?
          </h2>
          <p className="text-white/80 text-sm sm:text-base mb-8 max-w-md">
            Join thousands of men who switched to research-backed testosterone support.
          </p>

          <Link
            href="/product"
            className="inline-flex items-center justify-center h-12 px-10 rounded-[5px] bg-secondary text-white font-heading font-bold text-base uppercase tracking-wide hover:bg-secondary-hover transition-colors mb-8"
          >
            Shop Now
          </Link>

          <div className="flex items-center gap-6 text-white/70 text-xs sm:text-sm">
            <span>&#10003; Free Shipping</span>
            <span>&#10003; 30-Day Guarantee</span>
            <span>&#10003; No Commitment</span>
          </div>

          <div className="mt-10">
            <Image
              src="/product-bottle.png"
              alt="Peak Performance"
              width={200}
              height={300}
              className="w-32 sm:w-44 h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
