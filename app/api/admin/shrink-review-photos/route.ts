import { NextRequest, NextResponse } from "next/server";
import { shrinkStoredReviewPhotos } from "@/lib/shrink-review-photos";

// Re-encoding several full-resolution photos takes a few seconds.
export const maxDuration = 60;

/**
 * Shrinks review photos that were stored at full resolution.
 *
 * Reachable only behind the admin session cookie - middleware.ts gates
 * /api/admin/*. Safe to run repeatedly: rows already small are skipped, so a
 * second run reports zero rewrites.
 *
 * Measures without writing unless the body contains { "apply": true }.
 */
export async function POST(req: NextRequest) {
  let apply = false;
  try {
    const body = await req.json();
    apply = body?.apply === true;
  } catch {
    // No body - treat as a dry run.
  }

  try {
    const result = await shrinkStoredReviewPhotos({ apply });
    console.log(
      `Review photo shrink (${apply ? "applied" : "dry run"}): ${result.photos} photo(s), ` +
        `${result.bytesBefore} -> ${result.bytesAfter} bytes, ${result.rewritten} rewritten`
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("Review photo shrink failed:", err);
    return NextResponse.json(
      { error: "Could not shrink review photos." },
      { status: 500 }
    );
  }
}
