"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Lock } from "lucide-react";

const cards = [
  {
    icon: Sparkles,
    tag: "Step 1",
    title: "Foundational Hormone Inputs",
    text: "Vitamin D3, zinc, magnesium, and fenugreek provide the essential nutrients and enzymatic support your body relies on for testosterone synthesis.",
  },
  {
    icon: Brain,
    tag: "Step 2",
    title: "Stress Balance",
    text: "Chronic stress elevates cortisol, which suppresses testosterone production. KSM-66 Ashwagandha and Tongkat Ali help lower cortisol, removing a key barrier to hormonal balance.",
  },
  {
    icon: Lock,
    tag: "Step 3",
    title: "Free Testosterone Availability",
    text: "Boron reduces SHBG, the protein that binds testosterone and limits its use — helping make more of your natural T available for the body.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowFormulaWorks() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">
            The System
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            How the Formula Works
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Peak Performance targets three biological limiters that commonly affect testosterone
            function and performance in men.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mt-10"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={itemVariants}
                className="bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-200 hover:shadow-[0_12px_40px_rgba(45,148,255,0.10)] hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center text-center"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="inline-block text-[10px] lg:text-[11px] font-semibold uppercase tracking-wider text-primary/70 bg-primary/[0.06] px-2 py-0.5 rounded mb-3">
                  {card.tag}
                </span>
                <h3 className="text-gray-900 font-bold text-base sm:text-[17px] lg:text-lg mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm lg:text-[15px] leading-relaxed">{card.text}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
