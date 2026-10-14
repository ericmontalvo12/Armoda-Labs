"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, LISTED_PRODUCTS } from "@/lib/catalog";

/**
 * Category browser: pills switch the grid beneath them. This is the only
 * category section on the homepage — it replaces the reference layout's
 * stacked "Product Category" tabs plus "Categories" tiles, which navigate to
 * the same places twice.
 *
 * Categories with no listed products are dropped rather than shown empty,
 * so a class whose only SKUs are restricted does not render a dead tab.
 */
export function ProductCategories() {
  const populated = CATEGORIES.filter((c) =>
    LISTED_PRODUCTS.some((p) => p.categorySlug === c.slug)
  );
  const [active, setActive] = useState(populated[0]?.slug ?? "");

  if (populated.length === 0) return null;

  const shown = LISTED_PRODUCTS.filter((p) => p.categorySlug === active);
  const activeCategory = populated.find((c) => c.slug === active);

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-14">
        <SectionHeading title="Shop by class" />

        <div
          role="tablist"
          aria-label="Product categories"
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          {populated.map((c) => {
            const selected = c.slug === active;
            return (
              <button
                key={c.slug}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setActive(c.slug)}
                className={`rounded-full px-4 py-2 font-heading text-xs font-bold transition-colors ${
                  selected
                    ? "bg-gold text-text-on-gold"
                    : "border border-border bg-background text-text-secondary hover:border-gold hover:text-gold-text"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {activeCategory && (
          <p className="mt-5 text-center text-xs text-text-muted">
            {activeCategory.blurb}
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/products/category/${active}`}
            className="inline-flex h-11 items-center rounded-[10px] border border-border bg-background px-6 font-heading text-base font-bold text-text-primary transition-colors hover:border-gold hover:text-gold-text"
          >
            View all {activeCategory?.name}
          </Link>
        </div>
      </div>
    </section>
  );
}
