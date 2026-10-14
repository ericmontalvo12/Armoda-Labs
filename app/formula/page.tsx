"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, ArrowRight, X, FlaskConical, Shield, FileText } from "lucide-react";

const ingredients = [
  {
    name: "Vitamin D3",
    form: "Cholecalciferol",
    dosage: "3,000 IU",
    image: "/vitamin-d3.png",
    shortDesc:
      "In a 12-month RCT (Pilz et al., 2011), men with low vitamin D who supplemented with 3,332 IU/day saw significant increases in total, free, and bioactive testosterone vs. placebo.",
    benefits: [
      "Increased total testosterone in clinical trials",
      "Supports free and bioactive testosterone levels",
      "Corrects a deficiency linked to low T",
    ],
    research: [
      {
        title: "Effect of vitamin D supplementation on testosterone levels in men",
        url: "https://www.thieme-connect.de/products/ejournals/abstract/10.1055/s-0030-1269854",
      },
    ],
  },
  {
    name: "Zinc",
    form: "Citrate",
    dosage: "20 mg",
    image: "/zinc.png",
    shortDesc:
      "In a study by Prasad et al. (1996), zinc-deficient men had significantly lower testosterone, and supplementation restored levels over 6 months.",
    benefits: [
      "Required for testosterone synthesis",
      "Restores T levels in deficient men (Prasad et al., 1996)",
      "One of the most studied T-support minerals",
    ],
    research: [
      {
        title: "Zinc status and serum testosterone levels in adult males (Prasad et al., 1996)",
        url: "https://pubmed.ncbi.nlm.nih.gov/8875519/",
      },
    ],
  },
  {
    name: "Boron",
    form: "Citrate",
    dosage: "9 mg",
    image: "/boron.png",
    shortDesc:
      "In a 2011 trial (Naghii et al.), 10mg/day of boron increased free testosterone and reduced SHBG in healthy men within 7 days.",
    benefits: [
      "Increases free testosterone levels",
      "Reduces SHBG (testosterone-binding protein)",
      "Significant changes observed within 7 days (Naghii et al., 2011)",
    ],
    research: [
      {
        title: "Comparative effects of daily boron supplementation on plasma steroid hormones",
        url: "https://pubmed.ncbi.nlm.nih.gov/21129941/",
      },
    ],
  },
  {
    name: "Ashwagandha",
    form: "KSM-66 Root Extract",
    dosage: "500 mg",
    image: "/ashwagandha.png",
    shortDesc:
      "In a 2019 RCT (Lopresti et al.), 600mg/day of KSM-66 was associated with a 14–17% increase in testosterone in overweight men aged 40–70.",
    benefits: [
      "14–17% testosterone increase (Lopresti et al., 2019)",
      "Reduces cortisol (which suppresses T)",
      "Dual-action: direct and indirect T support",
    ],
    research: [
      {
        title: "Ashwagandha supplementation and testosterone in overweight men",
        url: "https://pubmed.ncbi.nlm.nih.gov/31517876/",
      },
    ],
  },
  {
    name: "Tongkat Ali",
    form: "200:1 Eurycomanone",
    dosage: "300 mg",
    image: "/tongkat-ali.png",
    shortDesc:
      "In a 4-week RCT (Tambi et al., 2012), 200mg/day of Physta extract increased testosterone by 37% in moderately stressed men.",
    benefits: [
      "37% testosterone increase in 4-week RCT (Tambi et al., 2012)",
      "16% cortisol reduction (Tambi et al., 2012)",
      "Releases bound testosterone from SHBG",
    ],
    research: [
      {
        title: "Eurycoma longifolia and androgenic status in moderately stressed males",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3669033/",
      },
    ],
  },
  {
    name: "Fenugreek",
    form: "50% Saponins Extract",
    dosage: "500 mg",
    image: "/fenugreek.png",
    shortDesc:
      "A 2020 meta-analysis (Mansoori et al.) of clinical trials found that fenugreek extract supplementation significantly increased total testosterone levels in men.",
    benefits: [
      "Significant T increase across multiple studies (Mansoori et al., 2020)",
      "May inhibit testosterone-to-estrogen conversion",
      "Meta-analysis confirmed effectiveness",
    ],
    research: [
      {
        title: "Effect of fenugreek extract supplement on testosterone levels in male: A meta-analysis (Mansoori et al., 2020)",
        url: "https://pubmed.ncbi.nlm.nih.gov/32048383/",
      },
    ],
  },
  {
    name: "Magnesium",
    form: "Bisglycinate",
    dosage: "28.6 mg",
    image: "/magnesium.png",
    shortDesc:
      "In a study by Cinar et al. (2011), magnesium supplementation was associated with higher total and free testosterone in both athletes and sedentary men.",
    benefits: [
      "Positively correlated with testosterone levels (Cinar et al., 2011)",
      "Supports both total and free testosterone",
      "Essential mineral depleted by training",
    ],
    research: [
      {
        title: "Effects of magnesium supplementation on testosterone levels (Cinar et al., 2011)",
        url: "https://pubmed.ncbi.nlm.nih.gov/20352370/",
      },
    ],
  },
];

const whatsNotItems = [
  { text: "Proprietary blends that hide real doses" },
  { text: "Underdosed ingredients for label appeal" },
  { text: "Ingredients with no evidence behind them" },
  { text: "Cheap fillers to reduce cost" },
];

export default function FormulaPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = ingredients[selectedIndex];

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-surface/50 scroll-smooth">
      <Header />
      <main className="pt-28 sm:pt-32">
        {/* Hero */}
        <section className="pb-8 sm:pb-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Every Ingredient. Every Dose. Fully Transparent.
            </h1>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-text-muted text-sm">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                Backed by human studies
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                Standardized extracts, nothing hidden
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                Batch tested for quality
              </span>
            </div>
          </div>
        </section>

        {/* Ingredient Library */}
        <section
          id="ingredient-library"
          className="pt-8 pb-12 sm:pt-10 sm:pb-14"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-lg py-3 px-6 mb-8">
              <h2 className="font-heading text-base sm:text-lg font-bold text-white uppercase tracking-wide text-center">
                The Full Formula
              </h2>
            </div>

            {/* Mobile: Pill selector + image + detail card */}
            <div className="lg:hidden">
              <div
                className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide"
                style={{ touchAction: "pan-x pinch-zoom" }}
              >
                {ingredients.map((ingredient, index) => (
                  <button
                    key={ingredient.name}
                    onClick={() => setSelectedIndex(index)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedIndex === index
                        ? "bg-primary text-white"
                        : "bg-surface border border-border text-text-secondary"
                    }`}
                  >
                    {ingredient.name}
                  </button>
                ))}
              </div>

              <div className="flex justify-center py-4">
                <motion.div
                  key={selected.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-36 h-36 rounded-full bg-surface border-2 border-primary/10 flex items-center justify-center overflow-hidden">
                    <Image
                      src={selected.image}
                      alt={selected.name}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div
                key={`mobile-${selected.name}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-primary rounded-lg overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading text-lg font-bold text-white">
                      {selected.name}
                    </h3>
                    <span className="text-xs font-heading font-bold px-2 py-1 rounded-[5px] bg-white/20 text-white">
                      {selected.dosage}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs mb-3">{selected.form}</p>
                  <p className="text-white text-sm leading-relaxed mb-4">
                    {selected.shortDesc}
                  </p>

                  <h4 className="text-white/70 font-heading font-medium text-[10px] mb-2 uppercase tracking-wide">
                    Key Benefits
                  </h4>
                  <ul className="space-y-1.5 mb-4">
                    {selected.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-white text-xs leading-snug">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {selected.research?.[0] && (
                    <a
                      href={selected.research[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-white text-primary font-heading font-semibold text-xs hover:bg-white/90 transition-colors"
                    >
                      See the Research
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Desktop: 3-column layout */}
            <div className="hidden lg:block bg-white rounded-lg border border-border p-6 overflow-hidden">
              <div className="grid lg:grid-cols-12 gap-5 items-stretch">
                {/* Left: All ingredients */}
                <div className="lg:col-span-3 flex flex-col gap-1.5">
                  {ingredients.map((ingredient, index) => (
                    <button
                      key={ingredient.name}
                      onClick={() => setSelectedIndex(index)}
                      className={`text-left px-3 py-2.5 rounded-lg transition-all ${
                        selectedIndex === index
                          ? "bg-primary/10 border-l-4 border-primary"
                          : "hover:bg-surface border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm ${
                            selectedIndex === index
                              ? "text-primary font-semibold"
                              : "text-text-secondary font-medium"
                          }`}
                        >
                          {ingredient.name}
                        </span>
                        <span
                          className={`text-[10px] font-heading font-bold px-1.5 py-0.5 rounded-[5px] ${
                            selectedIndex === index
                              ? "bg-primary text-white"
                              : "bg-surface text-text-muted"
                          }`}
                        >
                          {ingredient.dosage}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Center: Image */}
                <div className="lg:col-span-3 flex justify-center items-center py-2">
                  <motion.div
                    key={selected.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-64 h-64 rounded-full bg-surface border-4 border-primary/10 flex items-center justify-center overflow-hidden">
                      <Image
                        src={selected.image}
                        alt={selected.name}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Right: Detail panel */}
                <motion.div
                  key={`panel-${selected.name}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:col-span-6 rounded-lg bg-primary overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold text-white mb-1.5">
                      {selected.name}
                    </h3>
                    <p className="text-white text-base leading-relaxed mb-4">
                      {selected.shortDesc}
                    </p>

                    <div className="bg-white/10 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center border-b border-white/15 pb-2 mb-2">
                        <span className="text-white/80 text-sm">Dose</span>
                        <span className="text-white font-heading font-semibold text-sm">
                          {selected.dosage}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">Form</span>
                        <span className="text-white text-sm text-right max-w-[65%]">
                          {selected.form}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-white font-heading font-medium text-xs mb-2 uppercase tracking-wide">
                      Key Benefits
                    </h4>
                    <ul className="space-y-1.5 mb-4">
                      {selected.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-white text-sm leading-snug">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {selected.research?.[0] && (
                      <a
                        href={selected.research[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-[5px] bg-white text-primary font-heading font-semibold text-sm hover:bg-white/90 transition-colors"
                      >
                        See the Research
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Not in the Formula */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-lg py-3 px-6 mb-8">
              <h2 className="font-heading text-base sm:text-lg font-bold text-white uppercase tracking-wide text-center">
                What We Left Out
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {whatsNotItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-border"
                >
                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <X className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-text-secondary text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality You Can Trust */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-lg py-3 px-6 mb-8">
              <h2 className="font-heading text-base sm:text-lg font-bold text-white uppercase tracking-wide text-center">
                Quality You Can Trust
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="flex justify-center">
                <Image
                  src="/quality-bottle.jpg"
                  alt="Peak Performance Bottle"
                  width={360}
                  height={450}
                  className="w-[280px] sm:w-[320px] lg:w-[360px] h-auto rounded-lg"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-text-primary text-sm">
                      Heavy Metals Tested
                    </h3>
                    <p className="text-xs text-text-muted">
                      Lead, mercury, arsenic screened
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-text-primary text-sm">
                      GMP Certified Facility
                    </h3>
                    <p className="text-xs text-text-muted">
                      Manufactured in a U.S. GMP-certified facility
                    </p>
                  </div>
                </div>

                <Link
                  href="/lab-results"
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border hover:border-primary/30 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">
                      Certificate of Analysis
                    </h3>
                    <p className="text-xs text-text-muted">
                      Every batch, lot by lot
                    </p>
                  </div>
                </Link>

                <Link
                  href="/product"
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border hover:border-primary/30 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">
                      Fully Disclosed Label
                    </h3>
                    <p className="text-xs text-text-muted">
                      View Supplement Facts on the product page
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
