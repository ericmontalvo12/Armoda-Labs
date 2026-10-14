import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/layout";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional and account pages - no search value, and /success
      // can carry a Stripe session id in the query string.
      disallow: ["/api/", "/admin", "/cart", "/manage", "/success"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
