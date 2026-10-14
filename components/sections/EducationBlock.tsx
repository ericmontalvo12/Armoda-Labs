"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ingredients = [
  { name: "Vitamin D3", dose: "3,000 IU", image: "/vitamin-d3.png" },
  { name: "Ashwagandha", dose: "500mg KSM-66", image: "/ashwagandha.png" },
  { name: "Tongkat Ali", dose: "300mg 200:1", image: "/tongkat-ali.png" },
  { name: "Fenugreek", dose: "500mg", image: "/fenugreek.png" },
  { name: "Magnesium", dose: "28.6mg", image: "/magnesium.png" },
  { name: "Zinc", dose: "20mg", image: "/zinc.png" },
  { name: "Boron", dose: "9mg", image: "/boron.png" },
];

export function EducationBlock() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header — Bucked Up style red banner */}
        <div className="bg-primary rounded-lg px-5 py-3 mb-8 sm:mb-10">
          <h2 className="font-heading font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
            What&apos;s Inside
          </h2>
        </div>

        <p className="text-text-secondary text-sm sm:text-base mb-8 max-w-xl">
          7 research-backed ingredients at clinical doses. No proprietary blends, no fillers.
        </p>

        {/* Ingredients — horizontal scroll on mobile, grid on desktop */}
        <div className="sm:hidden flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.name}
              className="flex-shrink-0 w-[140px] bg-surface rounded-lg border border-border overflow-hidden"
            >
              <div className="aspect-square bg-white relative">
                <Image
                  src={ingredient.image}
                  alt={ingredient.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-heading font-bold text-text-primary text-sm">
                  {ingredient.name}
                </p>
                <p className="text-primary text-xs font-semibold mt-0.5">
                  {ingredient.dose}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:grid grid-cols-7 gap-4">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.name}
              className="bg-surface rounded-lg border border-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="aspect-square bg-white relative">
                <Image
                  src={ingredient.image}
                  alt={ingredient.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-heading font-bold text-text-primary text-sm">
                  {ingredient.name}
                </p>
                <p className="text-primary text-xs font-semibold mt-0.5">
                  {ingredient.dose}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/formula"
            className="inline-flex items-center gap-2 font-heading font-bold text-sm text-primary uppercase tracking-wide hover:gap-3 transition-all"
          >
            See Full Ingredient Breakdown
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
