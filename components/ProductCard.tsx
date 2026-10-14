"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, type Product } from "@/lib/catalog";

/**
 * Catalog card. Geometry follows the measured reference: flat surface, hairline
 * border, no shadow, generous radius. The spec line sits directly under the
 * name because peptides are bought on spec, not on marketing copy — so the card
 * carries no claim text at all, by design.
 */
export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const purchasable = product.priceCents > 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[20px] border border-border bg-background transition-colors hover:border-gold">
      <Link
        href={`/products/${product.slug}`}
        className="block bg-surface-elevated"
      >
        <Image
          src={product.image}
          alt={product.name}
          width={294}
          height={260}
          className="h-[200px] w-full object-contain p-4 sm:h-[240px]"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-heading text-sm font-extrabold leading-snug text-text-primary">
          <Link href={`/products/${product.slug}`} className="hover:text-gold-text">
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-text-muted">{product.spec}</p>

        <div className="mt-auto flex items-end justify-between pt-4">
          <span className="font-heading text-lg font-extrabold text-text-primary">
            {formatPrice(product.priceCents)}
          </span>
          {purchasable ? (
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() =>
                addToCart({
                  id: product.slug,
                  name: product.name,
                  price: product.priceCents / 100,
                  image: product.image,
                })
              }
              className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary text-on-primary transition-colors hover:bg-gold-hover"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="rounded-[10px] border border-border px-3 py-2 text-xs font-heading font-bold text-gold-text transition-colors hover:border-gold"
            >
              Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
