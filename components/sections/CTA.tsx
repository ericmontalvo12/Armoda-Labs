"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section id="science" className="py-16 sm:py-24 lg:py-32 relative overflow-x-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-text-primary mb-4 sm:mb-6">
            Ready to Feel the Difference?
          </h2>

          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8 sm:mb-10">
            Join athletes and high performers who trust Rock Mountain
            Performance for science-backed testosterone support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Shop Peak Performance</Button>
            <Button size="lg" variant="outline">
              View Full Ingredient List
            </Button>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 sm:mt-16 flex flex-wrap gap-3 sm:gap-8 justify-center items-center"
          >
            {/* TODO: Add trust badges/certifications from rockmountainperformance.com */}
            <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-border bg-surface/50 text-text-muted text-xs sm:text-sm">
              GMP Certified
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-border bg-surface/50 text-text-muted text-xs sm:text-sm">
              Made in USA
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-border bg-surface/50 text-text-muted text-xs sm:text-sm">
              Batch Tested
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
