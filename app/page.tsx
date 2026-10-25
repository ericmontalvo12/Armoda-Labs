import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroPanel } from "@/components/sections/home/HeroPanel";
import { WhyArmoda } from "@/components/sections/home/WhyArmoda";
import { ProductCategories } from "@/components/sections/home/ProductCategories";
import { CommitmentBand } from "@/components/sections/home/CommitmentBand";
import { FromTheLibrary } from "@/components/sections/home/FromTheLibrary";
import { NeedToKnow } from "@/components/sections/home/NeedToKnow";

export default function Home() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main>
        <HeroPanel />
        <WhyArmoda />
        {/* The reference sells nothing on its homepage because its catalog is
            gated behind a reviewed account. Ours is open, so the category
            browser stays — removing it would leave no path to the products. */}
        <ProductCategories />
        <CommitmentBand />
        <FromTheLibrary />
        <NeedToKnow />
      </main>
      <Footer />
    </div>
  );
}
