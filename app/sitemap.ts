import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/layout";
import { blogPosts } from "@/lib/blog-posts";
import { CATEGORIES, LISTED_PRODUCTS } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/products", priority: 0.9, changeFrequency: "weekly" },
    { path: "/lab-results", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/apply", priority: 0.6, changeFrequency: "monthly" },
    { path: "/wholesale", priority: 0.5, changeFrequency: "monthly" },
    { path: "/affiliate", priority: 0.5, changeFrequency: "monthly" },
    { path: "/help", priority: 0.5, changeFrequency: "monthly" },
    { path: "/how-to-pay", priority: 0.4, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.4, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.4, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
    { path: "/shipping-and-claims", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" },
    { path: "/ugc-policy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/affiliate-terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/products/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...LISTED_PRODUCTS.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
