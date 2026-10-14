"use client";

import Image from "next/image";

const badges = [
  { src: "/gmp-certified.png", alt: "GMP Certified", label: "GMP Certified" },
  { src: "/made-in-usa.png", alt: "Made in USA", label: "Made in USA" },
  { src: "/lab-tested.png", alt: "Lab Tested", label: "Lab Tested" },
];

export function TrustBar() {
  return (
    <section className="bg-surface py-6 sm:py-8 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-8 sm:gap-16">
          {badges.map((badge) => (
            <div key={badge.alt} className="flex flex-col items-center gap-2">
              <Image
                src={badge.src}
                alt={badge.alt}
                width={56}
                height={56}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
              <span className="text-[10px] sm:text-xs font-heading font-bold text-text-secondary uppercase tracking-wider">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
