import type { Metadata } from "next";
import { SITE_URL } from "@/app/layout";
import { getPostBySlug } from "@/lib/blog-posts";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  return {
    // Absolute: article headlines already run 60-80 chars, so appending the
    // brand suffix would push them past what Google displays.
    title: { absolute: post.title },
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      images: [{ url: post.coverImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return <>{children}</>;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [`${SITE_URL}${post.coverImage}`],
    datePublished: new Date(post.date).toISOString(),
    articleSection: post.category,
    author: {
      "@type": "Organization",
      name: "Rock Mountain Performance",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Rock Mountain Performance",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon-192.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
