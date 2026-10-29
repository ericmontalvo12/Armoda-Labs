import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { LISTED_PRODUCTS, productImage } from "@/lib/catalog";
import { PanelHeading } from "@/components/sections/home/PanelHeading";

/**
 * Real products on the homepage.
 *
 * The category browser says what kinds of things exist; this says what is
 * actually in the catalog. Products with a generated tile come first,
 * because a row where half the cards read "Image pending" undersells the
 * eight that are finished.
 */
export function FeaturedProducts({ limit = 4 }: { limit?: number }) {
  // product.image is always the placeholder in the catalog data; the real
  // tile is resolved by productImage() from the generated structure set.
  const hasTile = (p: (typeof LISTED_PRODUCTS)[number]) =>
    productImage(p).startsWith("/structures/");
  const withImages = LISTED_PRODUCTS.filter(hasTile);
  const rest = LISTED_PRODUCTS.filter((p) => !hasTile(p));
  const picks = [...withImages, ...rest].slice(0, limit);

  if (picks.length === 0) return null;

  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="relative overflow-hidden rounded-[24px] border border-border bg-surface px-6 py-10 sm:px-12 sm:py-12">
          <span className="absolute left-10 top-0 h-[3px] w-24 bg-gold" />
          <div className="flex flex-wrap items-end justify-between gap-4">
            <PanelHeading title="In the catalog" />
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-heading font-bold text-gold-text transition-colors hover:text-gold-hover"
            >
              All products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {picks.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
