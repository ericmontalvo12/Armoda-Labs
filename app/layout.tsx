import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

// The canonical production origin, used for canonical tags, OG URLs, the
// sitemap, and JSON-LD. Deliberately NOT read from NEXT_PUBLIC_SITE_URL:
// that var legitimately differs per environment (Stripe redirects need the
// current deployment's URL), but a canonical must always name the real
// production host or preview builds would tell Google to index preview URLs.
export const SITE_URL = "https://www.rockmountainperformance.com";

const DEFAULT_TITLE =
  "Rock Mountain Performance | Research-Aligned Testosterone Support";
const DEFAULT_DESCRIPTION =
  "Science-backed testosterone support formula designed to support healthy testosterone levels, improve training performance, and optimize daily vitality.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  // Child routes set only their own page name; this appends the brand.
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Rock Mountain Performance",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  // Proves domain ownership to Meta, which is a prerequisite for Aggregated
  // Event Measurement — without it iOS conversions can't be attributed to ads.
  other: {
    "facebook-domain-verification": "2hlf5lgboz8j8psb8boqrkkwczvg43",
  },
  openGraph: {
    type: "website",
    siteName: "Rock Mountain Performance",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Peak Performance — Built for Men Who Read Labels" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  keywords: [
    "testosterone support",
    "peak performance",
    "strength",
    "energy",
    "recovery",
    "research-aligned doses",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased overflow-x-hidden">
          <Providers>{children}</Providers>
        </body>
    </html>
  );
}
