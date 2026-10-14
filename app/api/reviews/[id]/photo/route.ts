import { NextResponse } from "next/server";
import { getReviewPhoto } from "@/lib/reviews-db";
import { PHOTO_REENCODE_THRESHOLD_BYTES, shrinkPhoto } from "@/lib/review-photos";

/**
 * Serves a single review photo.
 *
 * The review list used to inline every photo as a base64 data URL, so each
 * product page view pulled ~5.5MB out of Neon. Photos now come from here, one
 * request each, with an immutable cache header: the CDN serves repeat views and
 * the database is touched about once per photo.
 *
 * A review's photo cannot be edited once submitted, so the response is safe to
 * treat as immutable.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reviewId = Number(id);
  if (!Number.isInteger(reviewId) || reviewId < 1) {
    return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
  }

  try {
    const photo = await getReviewPhoto(reviewId);
    if (!photo) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Photos uploaded before the size cap are still full-resolution in the
    // database. Shrink those on the way out so a cache miss costs kilobytes
    // to serve, even though the row itself is still large.
    let { body, contentType } = photo;
    if (body.byteLength > PHOTO_REENCODE_THRESHOLD_BYTES) {
      const shrunk = await shrinkPhoto(body);
      if (shrunk) ({ body, contentType } = shrunk);
    }

    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(body.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Failed to load review photo", reviewId, err);
    return NextResponse.json({ error: "Failed to load photo" }, { status: 500 });
  }
}
