import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

// The canonical production origin, used for canonical tags, OG URLs, the
// sitemap, and JSON-LD. Deliberately NOT read from NEXT_PUBLIC_SITE_URL:
// that var legitimately differs per environment (Stripe redirects need the
// current deployment's URL), but a canonical must always name the real
// production host or preview builds would tell Google to index preview URLs.
// NOTE: armodalabs.com is a placeholder standing in for the retired Rock
// Mountain origin — confirm the real production domain before launch, since
// a wrong value here poisons canonicals, OG URLs, the sitemap and JSON-LD.
export const SITE_URL = "https://www.armodalabs.com";

const DEFAULT_TITLE =
  "Armoda Labs | Research Peptides, Independently Tested";
// Describes what the material IS and how it is documented. It states no
// effect, which is both accurate and the only defensible position here —
// a meta description is advertising and is read as intended use.
const DEFAULT_DESCRIPTION =
  "Defined-sequence research peptides supplied for laboratory use only. Every lot is independently tested, with the certificate of analysis published against the lot number on the vial.";

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
    template: "%s | Armoda Labs",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Armoda Labs",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Armoda Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  keywords: [
    "research peptides",
    "laboratory research",
    "certificate of analysis",
    "third-party tested",
    "lyophilized peptides",
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
