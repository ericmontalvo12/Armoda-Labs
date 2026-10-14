"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    image: "/batch-testing.png",
    label: "Quality",
    claim: "Every batch independently tested",
    description: "Batch tested for purity and potency before shipment.",
  },
  {
    image: "/research-backed.png",
    label: "Research",
    claim: "Research-backed formulation",
    description: "Every ingredient matches published human study doses.",
  },
  {
    image: "/supplement-label.png",
    label: "Transparency",
    claim: "Exact doses, fully disclosed",
    description: "No proprietary blends. See exactly what you're taking.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Features() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">
            Built Different
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            What Makes This Different
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.label}
              variants={itemVariants}
              className="group bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)] hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-[16/10] bg-gray-50 relative overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.claim}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                {/* Label chip */}
                <span className="inline-block text-[10px] lg:text-[11px] font-semibold uppercase tracking-wider text-primary/70 bg-primary/[0.06] px-2 py-0.5 rounded mb-3">
                  {feature.label}
                </span>

                <h3 className="text-gray-900 font-bold text-base sm:text-[17px] lg:text-lg mb-2">
                  {feature.claim}
                </h3>
                <p className="text-gray-600 text-sm lg:text-[15px] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
