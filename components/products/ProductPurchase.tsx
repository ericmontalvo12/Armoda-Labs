"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, FlaskConical } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, productImage, type Product } from "@/lib/catalog";

const MAX_QTY = 10;

export function ProductPurchase({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const variant = product.variants[variantIndex];
  const purchasable = variant.priceCents > 0;
  const sku = `${product.sku}${variant.skuSuffix}`;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="overflow-hidden rounded-[20px] border border-border bg-surface-elevated">
        <Image
          src={productImage(product)}
          alt={product.name}
          width={600}
          height={600}
          priority
          className="h-full max-h-[460px] w-full object-contain p-8"
        />
      </div>

      <div>
        <h1 className="font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          SKU: <span className="text-text-secondary">{sku}</span>
        </p>
        <p className="mt-1 text-sm text-text-secondary">{product.spec}</p>

        {product.variants.length > 1 && (
          <fieldset className="mt-6">
            <legend className="mb-2 text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted">
              Format
            </legend>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => {
                const selected = i === variantIndex;
                return (
                  <button
                    key={v.label}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setVariantIndex(i)}
                    className={`rounded-[10px] px-4 py-2 font-heading text-sm font-bold transition-colors ${
                      selected
                        ? "bg-gold text-text-on-gold"
                        : "border border-border text-text-secondary hover:border-gold hover:text-gold"
                    }`}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="mt-6">
          <p className="mb-2 text-[10px] font-heading font-bold uppercase tracking-wider text-text-muted">
            Quantity
          </p>
          <div className="inline-flex items-center rounded-[10px] border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="flex h-11 w-11 items-center justify-center text-text-primary transition-colors hover:text-gold disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span
              aria-live="polite"
              className="w-12 text-center font-heading text-base font-bold text-text-primary"
            >
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
              disabled={qty >= MAX_QTY}
              className="flex h-11 w-11 items-center justify-center text-text-primary transition-colors hover:text-gold disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-baseline gap-3">
          {variant.comparePriceCents && (
            <span className="text-base text-text-muted line-through">
              {formatPrice(variant.comparePriceCents)}
            </span>
          )}
          <span className="font-heading text-3xl font-extrabold text-text-primary">
            {formatPrice(variant.priceCents)}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={!purchasable}
            onClick={() =>
              addToCart(
                {
                  id: sku,
                  name: `${product.name} — ${variant.label}`,
                  price: variant.priceCents / 100,
                  image: product.image,
                },
                qty
              )
            }
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] bg-primary px-6 font-heading text-base font-bold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {purchasable ? "Add to cart" : "Sign in for access"}
          </button>
          <Link
            href="/lab-results"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] border border-border px-6 font-heading text-base font-bold text-text-primary transition-colors hover:border-gold hover:text-gold"
          >
            <FlaskConical className="h-4 w-4" />
            Check lab report
          </Link>
        </div>

        {product.complianceNote && (
          <p className="mt-5 rounded-[10px] border border-border bg-surface px-4 py-3 text-xs leading-relaxed text-text-secondary">
            {product.complianceNote}
          </p>
        )}
      </div>
    </div>
  );
}
