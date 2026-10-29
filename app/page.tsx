import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroPanel } from "@/components/sections/home/HeroPanel";
import { WhyArmoda } from "@/components/sections/home/WhyArmoda";
import { ProductCategories } from "@/components/sections/home/ProductCategories";
import { FeaturedProducts } from "@/components/sections/home/FeaturedProducts";
import { CertificateBand } from "@/components/sections/home/CertificateBand";
import { CommitmentBand } from "@/components/sections/home/CommitmentBand";
import { FromTheLibrary } from "@/components/sections/home/FromTheLibrary";
import { NeedToKnow } from "@/components/sections/home/NeedToKnow";
import { HOME_LAYOUT } from "@/lib/home-layout";

/**
 * Three arrangements of the same sections. Change HOME_LAYOUT in
 * lib/home-layout.ts to switch; nothing here needs editing to try another.
 */
function Commerce() {
  return (
    <>
      <HeroPanel />
      {/* Products before the argument. The catalog is open, so there is
          nothing to justify before showing it. */}
      <FeaturedProducts />
      <ProductCategories />
      <CommitmentBand />
      <WhyArmoda />
      <CertificateBand />
      <NeedToKnow />
    </>
  );
}

function Proof() {
  return (
    <>
      <HeroPanel />
      {/* Verification before the sell: someone can check a lot number
          without an account and without having ordered. */}
      <CertificateBand />
      <WhyArmoda />
      <FeaturedProducts />
      <ProductCategories />
      <NeedToKnow />
      <CommitmentBand />
    </>
  );
}

function Editorial() {
  return (
    <>
      <HeroPanel />
      {/* The argument once, properly, instead of across four panels. */}
      <WhyArmoda />
      <ProductCategories />
      <CertificateBand />
      <FromTheLibrary />
    </>
  );
}

export default function Home() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main>
        {HOME_LAYOUT === "commerce" && <Commerce />}
        {HOME_LAYOUT === "proof" && <Proof />}
        {HOME_LAYOUT === "editorial" && <Editorial />}
      </main>
      <Footer />
    </div>
  );
}
