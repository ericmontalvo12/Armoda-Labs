import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { EducationBlock } from "@/components/sections/EducationBlock";
import { HomeReviews } from "@/components/sections/HomeReviews";
import { JoinCommunity } from "@/components/sections/JoinCommunity";

export default function Home() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <EducationBlock />
        <HomeReviews />
        <JoinCommunity />
      </main>
      <Footer />
    </div>
  );
}
