"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Product() {
  return (
    <section id="product" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Peak Performance
          </h2>

          <div className="text-gray-600 leading-relaxed max-w-xl mx-auto mb-8 space-y-4">
            <p>
              You've seen the problem.<br />
              Now look at the dosing.
            </p>
            <p>
              Every ingredient is listed.<br />
              Every dose matches published research.
            </p>
            <p>
              If you're going to evaluate this properly, start inside the formula.
            </p>
          </div>

          <div className="mb-6">
            <Link
              href="/formula"
              className="text-primary font-medium hover:text-primary/80 transition-colors"
            >
              See Inside the Formula →
            </Link>
          </div>

          <p className="text-gray-400 text-sm">
            30-day guarantee · No subscriptions
          </p>
        </motion.div>
      </div>
    </section>
  );
}
