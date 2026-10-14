"use client";

import Link from "next/link";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Josh",
    text: "I've been impressed with both the product and the company. The quality is excellent, the ingredients are thoughtfully chosen, and I'll definitely be ordering another bottle when this one runs out.",
    rating: 5,
  },
  {
    name: "David",
    text: "Really impressed with this supplement. I've tried a few testosterone support products before, and this is one of the first that actually uses quality ingredients like KSM-66 Ashwagandha and Tongkat Ali at effective doses.",
    rating: 5,
  },
  {
    name: "Karim",
    text: "After using Peak Performance consistently, I've felt more motivated to stick to my training schedule. My workouts have been more consistent, and I've been recovering well between sessions.",
    rating: 5,
  },
];

export function HomeReviews() {
  return (
    <section className="py-14 sm:py-20 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="bg-primary rounded-lg px-5 py-3 mb-8 sm:mb-10">
          <h2 className="font-heading font-bold text-white text-lg sm:text-xl uppercase tracking-wide">
            Reviews
          </h2>
        </div>

        {/* Rating Summary */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-star text-star"
              />
            ))}
          </div>
          <span className="font-heading font-bold text-text-primary text-lg">
            5.0
          </span>
          <Link
            href="/product#reviews"
            className="text-sm text-primary font-semibold hover:underline"
          >
            Based on 9 reviews
          </Link>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-white rounded-lg border border-border p-5 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-bold text-text-primary">
                  {review.name}
                </span>
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-star text-star"
                    />
                  ))}
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {review.text}
              </p>
              <p className="font-heading font-bold text-text-primary text-sm mt-4">
                Peak Performance
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/product#reviews"
            className="inline-flex items-center justify-center h-11 px-8 rounded-[5px] bg-secondary text-white font-heading font-bold text-sm uppercase tracking-wide hover:bg-secondary-hover transition-colors"
          >
            Read All Reviews
          </Link>
        </div>
      </div>
    </section>
  );
}
