import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/catalog";

/**
 * Reusable product band. The reference uses a carousel; this is a plain
 * responsive grid instead — same density, no JS, and it degrades to one
 * column on a phone without a horizontal scroll trap.
 */
export function ProductRail({
  title,
  products,
  tinted = false,
  cta,
}: {
  title: string;
  products: Product[];
  tinted?: boolean;
  cta?: { href: string; label: string };
}) {
  if (products.length === 0) return null;

  return (
    <section className={tinted ? "bg-surface" : "bg-background"}>
      <div className="mx-auto max-w-[1280px] px-4 py-14">
        <SectionHeading title={title} />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        {cta && (
          <div className="mt-10 text-center">
            <Link
              href={cta.href}
              className="inline-flex h-11 items-center rounded-[10px] bg-primary px-7 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover"
            >
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
