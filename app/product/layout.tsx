import type { Metadata } from "next";
import { SITE_URL } from "@/app/layout";
import { getReviews } from "@/lib/reviews-db";
import { getBundleTotal } from "@/lib/sale";

// Reviews change when customers submit; regenerate hourly so the
// aggregateRating in the schema stays close to reality without making
// the page fully dynamic.
export const revalidate = 3600;

const TITLE = "Peak Performance — Testosterone Support, 90 Capsules";
const DESCRIPTION =
  "Peak Performance combines zinc, magnesium, vitamin D3, KSM-66 ashwagandha, Tongkat Ali, fenugreek, and boron at fully disclosed, research-aligned doses. 30-day guarantee, free shipping.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/product" },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/product`,
    images: [{ url: "/product-bottle.png", alt: "Peak Performance bottle" }],
  },
};

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The DB is unavailable during local/CI builds without DATABASE_URL, and a
  // missing rating should never break the page - just omit that part.
  let ratingValue: number | null = null;
  let reviewCount = 0;
  try {
    const reviews = await getReviews();
    if (reviews.length > 0) {
      reviewCount = reviews.length;
      ratingValue =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    }
  } catch {
    // leave rating unset
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Peak Performance",
    description: DESCRIPTION,
    image: [`${SITE_URL}/product-bottle.png`],
    brand: { "@type": "Brand", name: "Rock Mountain Performance" },
    category: "Dietary Supplement",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product`,
      priceCurrency: "USD",
      price: getBundleTotal(1).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
      },
    },
    // Only emitted when real reviews exist - never fabricate a rating.
    ...(ratingValue !== null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: ratingValue.toFixed(1),
        reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
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
