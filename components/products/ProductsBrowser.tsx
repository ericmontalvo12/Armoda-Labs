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

  return (
    <>
      <div className="rounded-[20px] border border-border bg-surface p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="w-full rounded-[10px] border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-gold"
            />
          </div>

          <div className="lg:w-56">
            <label
              htmlFor="category"
              className="mb-1 block text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:w-52">
            <label
              htmlFor="sort"
              className="mb-1 block text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted"
            >
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
      </div>

      <p className="mt-6 text-sm text-text-muted" aria-live="polite">
        Showing <span className="text-text-primary">{results.length}</span> of{" "}
        <span className="text-text-primary">{total}</span> products
      </p>

      {results.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[20px] border border-border bg-surface p-12 text-center">
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
