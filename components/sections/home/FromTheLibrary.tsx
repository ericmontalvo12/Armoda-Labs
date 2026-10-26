import Link from "next/link";
import { PanelHeading } from "@/components/sections/home/PanelHeading";
import { blogPosts } from "@/lib/blog-posts";

/**
 * Renders nothing while there are no articles, rather than showing an empty
 * band. The blog is intentionally empty — see lib/blog-posts.ts for what may
 * and may not be written here.
 */
export function FromTheLibrary() {
  const posts = blogPosts.slice(0, 2);
  if (posts.length === 0) return null;

  return (
    <section className="bg-background pb-16">
      <div className="mx-auto max-w-[1280px] px-4">
        <PanelHeading title="From the library" />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <p className="text-sm leading-relaxed text-text-secondary">
            Analytical methodology, characterization data and compound
            background, written for people who read certificates.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-[20px] border border-border bg-surface p-6"
              >
                <h3 className="font-heading text-base font-extrabold leading-snug text-text-primary">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs text-text-muted">{post.date}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block font-heading text-sm font-bold text-gold hover:underline"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </div>

        <Link
          href="/blog"
          className="mt-8 inline-block font-heading text-sm font-bold text-gold hover:underline"
        >
          View more literature →
        </Link>
      </div>
    </section>
  );
}
