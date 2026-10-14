import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck, RotateCcw, FlaskConical, Headphones, ShieldCheck, Lock } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ResearchUseNotice } from "@/components/products/ResearchUseNotice";
import { ProductPurchase } from "@/components/products/ProductPurchase";
import { ProductTabs } from "@/components/products/ProductTabs";
import {
  LISTED_PRODUCTS,
  getCategoryBySlug,
  getProductBySlug,
  relatedProducts,
} from "@/lib/catalog";

export function generateStaticParams() {
  return LISTED_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name}, ${product.spec}. Supplied for laboratory research use only, independently assayed with a certificate of analysis published per lot.`,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

// Service facts only. Nothing here describes what the compound does.
const SERVICE = [
  {
    icon: Truck,
    title: "Shipping",
    body: "Same-day dispatch on weekday orders placed before the cut-off.",
    href: "/help",
    cta: "Shipping details",
  },
  {
    icon: RotateCcw,
    title: "Returns",
    body: "Unopened items can be raised within the policy window.",
    href: "/refund-policy",
    cta: "Refund policy",
  },
  {
    icon: FlaskConical,
    title: "Lab tested",
    body: "Every lot assayed by an independent laboratory before release.",
    href: "/lab-results",
    cta: "View certificates",
  },
  {
    icon: Headphones,
    title: "Support",
    body: "Questions about documentation or handling reach a person.",
    href: "/contact",
    cta: "Contact us",
  },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const related = relatedProducts(product);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="pt-28 lg:pt-32">
        <div className="mx-auto max-w-[1280px] px-4 pb-16">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
              <li>
                <Link href="/" className="hover:text-gold">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/products" className="hover:text-gold">Shop</Link>
              </li>
              {category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`/products/category/${category.slug}`}
                      className="hover:text-gold"
                    >
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-text-secondary">{product.name}</li>
            </ol>
          </nav>

          <div className="mt-6">
            <ResearchUseNotice />
          </div>

          <div className="mt-10">
            <ProductPurchase product={product} />
          </div>

          {/* Operational assurances — deliberately not purity or efficacy. */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: FlaskConical, label: "Independently assayed" },
              { icon: ShieldCheck, label: "Research use only" },
              { icon: Lock, label: "Secure checkout" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2 rounded-[20px] border border-border bg-surface px-4 py-4"
              >
                <Icon className="h-4 w-4 text-gold" />
                <span className="font-heading text-sm font-bold text-text-primary">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-px overflow-hidden rounded-[20px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE.map(({ icon: Icon, title, body, href, cta }) => (
              <div key={title} className="bg-surface p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-surface-accent">
                  <Icon className="h-4 w-4 text-gold" />
                </span>
                <h2 className="mt-4 font-heading text-sm font-extrabold text-text-primary">
                  {title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  {body}
                </p>
                <Link
                  href={href}
                  className="mt-3 inline-block text-xs font-heading font-bold text-gold hover:underline"
                >
                  {cta} →
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <ProductTabs product={product} />
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-heading text-2xl font-extrabold text-text-primary">
                  You may also like
                </h2>
                <Link
                  href="/products"
                  className="text-sm font-heading font-bold text-gold hover:underline"
                >
                  View all products →
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
