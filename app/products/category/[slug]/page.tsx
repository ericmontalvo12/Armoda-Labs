import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopHeader } from "@/components/products/ShopHeader";
import { ProductsBrowser } from "@/components/products/ProductsBrowser";
import { CATEGORIES, getCategoryBySlug } from "@/lib/catalog";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.name} from Armoda Labs — ${category.blurb} Third-party assayed, certificate of analysis published for every lot.`,
    alternates: { canonical: `/products/category/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main>
        <ShopHeader
          eyebrow="Product category"
          title={category.name}
          description={category.blurb}
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/products" },
            { label: category.name },
          ]}
        />
        <div className="mx-auto max-w-[1280px] px-4 py-10">
          <ProductsBrowser initialCategory={category.slug} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
