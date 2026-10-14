"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

const failReasons = [
  "Underdosed ingredients that never reach effective levels",
  "Proprietary blends that hide real ingredient amounts",
  "Ingredients with no evidence to raise testosterone",
];

export function WhyMostFail() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">
              The Problem
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Why Most Testosterone Supplements Fail
            </h2>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            {failReasons.map((reason, index) => (
              <li
                key={index}
                className="flex flex-col items-center text-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200/80"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {reason}
                </span>
              </li>
            ))}
          </motion.ul>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-700 text-sm sm:text-base leading-relaxed text-center border-t-2 border-primary pt-4"
          >
            Peak Performance was built differently — with clinical doses, full transparency, and
            ingredients chosen to support real hormonal function.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
