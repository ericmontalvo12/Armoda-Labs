import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopHeader } from "@/components/products/ShopHeader";
import { ProductsBrowser } from "@/components/products/ProductsBrowser";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Defined-sequence research peptides from Armoda Labs, third-party tested with a certificate of analysis published for every lot.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main>
        <ShopHeader
          eyebrow="Catalog"
          title="All products"
          description="Supplied for laboratory research use only. Not for human or veterinary use."
          crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        />
        <div className="mx-auto max-w-[1280px] px-4 py-10">
          <ProductsBrowser />
        </div>
      </main>
      <Footer />
    </div>
  );
}
