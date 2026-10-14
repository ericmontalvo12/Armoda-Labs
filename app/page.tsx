import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogHero } from "@/components/sections/home/CatalogHero";
import { TrustStrip } from "@/components/sections/home/TrustStrip";
import { ProductRail } from "@/components/sections/home/ProductRail";
import { CategoryTiles } from "@/components/sections/home/CategoryTiles";
import { TestingPromise } from "@/components/sections/home/TestingPromise";
import { LISTED_PRODUCTS } from "@/lib/catalog";

export default function Home() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main>
        <CatalogHero />
        <TrustStrip />
        <ProductRail
          title="Most requested"
          products={LISTED_PRODUCTS.slice(0, 4)}
          cta={{ href: "/products", label: "Explore all products" }}
        />
        <CategoryTiles />
        <TestingPromise />
      </main>
      <Footer />
    </div>
  );
}
