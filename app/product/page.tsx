import { getReviews } from "@/lib/reviews-db";
import ProductPageClient from "./ProductPageClient";

export default async function ProductPage() {
  let initialReviews: Awaited<ReturnType<typeof getReviews>> = [];
  // Distinguished from a genuinely empty list so the page does not tell every
  // visitor there are zero reviews when the database is simply unreachable.
  let reviewsUnavailable = false;
  try {
    initialReviews = await getReviews();
  } catch {
    reviewsUnavailable = true;
  }

  const count = initialReviews.length;
  const average =
    count > 0
      ? initialReviews.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;

  return (
    <ProductPageClient
      initialReviews={initialReviews}
      initialReviewCount={count}
      initialReviewAverage={average}
      reviewsUnavailable={reviewsUnavailable}
    />
  );
}
