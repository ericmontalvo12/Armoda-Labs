"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, LISTED_PRODUCTS, type Product } from "@/lib/catalog";

type SortKey = "name-asc" | "name-desc" | "price-asc" | "price-desc";

// No "popularity" option: there is no order data behind it yet, and a sort
// that silently does nothing is worse than one that is absent. Add it when
// orders can actually rank the catalog.
const SORTS: { key: SortKey; label: string }[] = [
  { key: "name-asc", label: "Name (A–Z)" },
  { key: "name-desc", label: "Name (Z–A)" },
  { key: "price-asc", label: "Price (low to high)" },
  { key: "price-desc", label: "Price (high to low)" },
];

function sortProducts(list: Product[], key: SortKey): Product[] {
  const out = [...list];
  switch (key) {
    case "name-desc":
      return out.sort((a, b) => b.name.localeCompare(a.name));
    // Unpriced items sort last either way — they are not comparable, and
    // floating them to the top of a price sort reads as broken.
    case "price-asc":
      return out.sort(
        (a, b) =>
          (a.priceCents || Infinity) - (b.priceCents || Infinity) ||
          a.name.localeCompare(b.name)
      );
    case "price-desc":
      return out.sort(
        (a, b) =>
          (b.priceCents || -1) - (a.priceCents || -1) ||
          a.name.localeCompare(b.name)
      );
    default:
      return out.sort((a, b) => a.name.localeCompare(b.name));
  }
}

const selectClass =
  "w-full appearance-none rounded-[10px] border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-gold";

export function ProductsBrowser({
  initialCategory = "all",
}: {
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>("name-asc");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = LISTED_PRODUCTS.filter((p) => {
      const inCategory = category === "all" || p.categorySlug === category;
      const matches =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.spec.toLowerCase().includes(q);
      return inCategory && matches;
    });
    return sortProducts(filtered, sort);
  }, [query, category, sort]);

  const total =
    category === "all"
      ? LISTED_PRODUCTS.length
      : LISTED_PRODUCTS.filter((p) => p.categorySlug === category).length;

  // Counts sit on the chips, so they are computed once from the full list
  // rather than from the filtered results - a chip reading "(0)" because of
  // the current search would be telling you about the wrong thing.
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of LISTED_PRODUCTS) {
      map.set(p.categorySlug, (map.get(p.categorySlug) ?? 0) + 1);
    }
    return map;
  }, []);

  const chips = [
    { slug: "all", name: "All", count: LISTED_PRODUCTS.length },
    ...CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      count: counts.get(c.slug) ?? 0,
    })),
  ];

  return (
    <>
      {/* Search leads, full width: on a catalog this is the primary way in,
          and burying it in a row of three controls understates it. */}
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products…"
          className="h-14 w-full rounded-full border border-border bg-surface pl-14 pr-5 text-base text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-gold"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-gold-text" aria-live="polite">
          Showing {results.length} of {total} results
        </p>

        <div>
          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={selectClass}
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chips rather than a select: with six categories the whole taxonomy
          is visible at once, and the counts tell you where the depth is
          before you click. */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {chips.map((c) => {
          const active = category === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              aria-pressed={active}
              className={
                active
                  ? "inline-flex items-center gap-2 rounded-full border border-gold bg-gold px-5 py-2.5 text-sm font-heading font-bold text-text-on-gold"
                  : "inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-heading font-bold text-text-secondary transition-colors hover:border-gold hover:text-text-primary"
              }
            >
              {c.name}
              <span className={active ? "text-text-on-gold/70" : "text-text-muted"}>
                ({c.count})
              </span>
            </button>
          );
        })}
      </div>

      {results.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[20px] border border-border bg-surface p-12 text-center">
          <p className="font-heading text-base font-extrabold text-text-primary">
            No products match that search
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-4 text-sm font-heading font-bold text-gold-text hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
