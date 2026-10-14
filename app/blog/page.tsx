"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blog-posts";

export default function BlogPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-surface/50">
      <Header />
      <main className="page-top pb-20">

        {/* Header */}
        <section className="py-8 sm:py-10">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
              Articles
            </h1>
          </div>
        </section>

        {/* Article list */}
        <section>
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            {blogPosts.length === 0 && (
              <div className="rounded-[20px] border border-border bg-surface p-12 text-center">
                <p className="font-heading text-base font-extrabold text-text-primary">
                  No articles yet
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  Technical notes and handling guidance will be published here.
                </p>
                <Link
                  href="/products"
                  className="mt-5 inline-block font-heading text-sm font-bold text-gold hover:underline"
                >
                  Browse the catalog →
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-6">
              {blogPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="group rounded-lg border border-border overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer bg-white">
                    {/* Cover image */}
                    <div className="w-full aspect-[16/9] bg-surface relative overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                      <h2 className="font-heading text-lg sm:text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-xs text-text-muted uppercase tracking-widest mb-3 font-medium">
                        {post.date} &nbsp;&bull;&nbsp; Rock Mountain Research
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
