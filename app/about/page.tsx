"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  Check,
  FlaskConical,
  FileText,
  Shield,
  AlertTriangle,
  Eye,
  Beaker,
} from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-surface/50">
      <Header />
      <main className="pt-28 sm:pt-32">
        {/* Hero */}
        <section className="pb-10 sm:pb-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-text-primary leading-tight max-w-xl mx-auto">
              Finally, a formula backed by human studies.
            </h1>
          </div>
        </section>

        {/* The Problem We Saw */}
        <section className="py-12 sm:py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-lg py-3 px-6 mb-8">
              <h2 className="font-heading text-base sm:text-lg font-bold text-white uppercase tracking-wide text-center">
                The Problem We Saw
              </h2>
            </div>
            <p className="text-text-muted text-sm text-center max-w-xl mx-auto mb-8">
              Most testosterone supplements are built for marketing, not results.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-lg border border-border flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-heading font-semibold text-text-primary mb-1.5 text-sm">
                  Underdosed Formulas
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Active ingredients at 20% of clinically studied doses. Looks good on labels, doesn&apos;t work in practice.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-border flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-3">
                  <Eye className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-heading font-semibold text-text-primary mb-1.5 text-sm">
                  Proprietary Blends
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Hidden behind &ldquo;complexes&rdquo; to avoid scrutiny. No way to verify what you&apos;re actually getting.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-border flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-3">
                  <Beaker className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-heading font-semibold text-text-primary mb-1.5 text-sm">
                  Ingredients With No Evidence
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Fillers and unproven compounds added for label appeal, not results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Formulate */}
        <section className="py-12 sm:py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-lg py-3 px-6 mb-8">
              <h2 className="font-heading text-base sm:text-lg font-bold text-white uppercase tracking-wide text-center">
                How We Formulate
              </h2>
            </div>
            <p className="text-text-muted text-sm text-center max-w-xl mx-auto mb-8">
              Three principles. No compromises.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-5 rounded-lg bg-white border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <FlaskConical className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-text-primary mb-1.5">
                  Research First
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Every ingredient backed by peer-reviewed human studies. No research, no inclusion.
                </p>
              </div>

              <div className="text-center p-5 rounded-lg bg-white border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-text-primary mb-1.5">
                  Research-Backed Doses
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Every ingredient dosed at levels shown effective in human studies. Not reduced for cost.
                </p>
              </div>

              <div className="text-center p-5 rounded-lg bg-white border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-text-primary mb-1.5">
                  Full Disclosure
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  No proprietary blends. Every ingredient and dose listed. Verify it yourself.
                </p>
              </div>
            </div>

            <p className="text-center text-text-muted text-sm mt-6 max-w-2xl mx-auto">
              We built this for real, lasting change — the kind you measure in how you recover, perform, and feel over time.
            </p>
          </div>
        </section>

        {/* Is This Right For You? */}
        <section className="py-12 sm:py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-lg py-3 px-6 mb-8">
              <h2 className="font-heading text-base sm:text-lg font-bold text-white uppercase tracking-wide text-center">
                Is This Right For You?
              </h2>
            </div>

            <div className="bg-white p-6 rounded-lg border border-border max-w-lg mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-text-primary text-sm">
                  Built for men who:
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-text-secondary text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  Want real hormonal support backed by research
                </li>
                <li className="flex items-start gap-3 text-text-secondary text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  Value fully disclosed ingredients at effective doses
                </li>
                <li className="flex items-start gap-3 text-text-secondary text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  Are ready to support energy, drive, and recovery
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* What We're Not */}
        <section className="py-12 sm:py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-primary mb-3">
              What We&apos;re Not
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto mb-4">
              Not a lifestyle brand. Not influencer-founded. We&apos;re athletes who got tired of taking supplements we didn&apos;t trust — so we built what should exist.
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 font-heading font-bold text-sm text-primary hover:underline"
            >
              See the Product
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
