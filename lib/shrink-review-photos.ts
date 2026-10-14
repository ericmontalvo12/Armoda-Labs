import { neon } from "@neondatabase/serverless";
import { PHOTO_REENCODE_THRESHOLD_BYTES, shrinkPhoto } from "./review-photos";

export type ShrinkAction =
  | "rewritten"
  | "would-rewrite"
  | "skipped-small"
  | "skipped-undecodable"
  | "skipped-malformed";

export interface ShrinkRow {
  id: number;
  beforeBytes: number;
  afterBytes: number;
  action: ShrinkAction;
}

export interface ShrinkResult {
  apply: boolean;
  photos: number;
  rewritten: number;
  bytesBefore: number;
  bytesAfter: number;
  rows: ShrinkRow[];
}

/**
 * Re-encodes review photos that were stored at full resolution, before uploads
 * were capped.
 *
 * Photos live in Postgres as base64 data URLs. Serving them is already cheap -
 * the list response no longer carries them and /api/reviews/[id]/photo shrinks
 * oversized rows on the way out - but the rows themselves are still large, so
 * every cache miss pulls megabytes out of Neon and the storage stays inflated.
 * This rewrites them in place.
 *
 * Idempotent: rows already under the threshold are left alone, so re-running
 * changes nothing. Pass apply: false to measure without writing.
 */
export async function shrinkStoredReviewPhotos(opts: {
  apply: boolean;
}): Promise<ShrinkResult> {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL (or POSTGRES_URL) in environment");
  }
  const sql = neon(connectionString);

  const stored = (await sql`
    SELECT id, photo_data_url
    FROM reviews
    WHERE photo_data_url IS NOT NULL
    ORDER BY id
  `) as Array<{ id: number; photo_data_url: string }>;

  const rows: ShrinkRow[] = [];
  let bytesBefore = 0;
  let bytesAfter = 0;
  let rewritten = 0;

  for (const row of stored) {
    // [\s\S] rather than the /s flag, which needs an es2018 target.
    const match = /^data:([^;,]+);base64,([\s\S]*)$/.exec(row.photo_data_url);
    if (!match) {
      rows.push({ id: row.id, beforeBytes: 0, afterBytes: 0, action: "skipped-malformed" });
      continue;
    }

    const original = Buffer.from(match[2], "base64");
    bytesBefore += original.byteLength;

    if (original.byteLength <= PHOTO_REENCODE_THRESHOLD_BYTES) {
      bytesAfter += original.byteLength;
      rows.push({
        id: row.id,
        beforeBytes: original.byteLength,
        afterBytes: original.byteLength,
        action: "skipped-small",
      });
      continue;
    }

    const shrunk = await shrinkPhoto(original);
    if (!shrunk) {
      bytesAfter += original.byteLength;
      rows.push({
        id: row.id,
        beforeBytes: original.byteLength,
        afterBytes: original.byteLength,
        action: "skipped-undecodable",
      });
      continue;
    }

    bytesAfter += shrunk.body.byteLength;

    if (opts.apply) {
      const dataUrl = `data:${shrunk.contentType};base64,${shrunk.body.toString("base64")}`;
      await sql`UPDATE reviews SET photo_data_url = ${dataUrl} WHERE id = ${row.id}`;
      rewritten++;
    }

    rows.push({
      id: row.id,
      beforeBytes: original.byteLength,
      afterBytes: shrunk.body.byteLength,
      action: opts.apply ? "rewritten" : "would-rewrite",
    });
  }

  return {
    apply: opts.apply,
    photos: stored.length,
    rewritten,
    bytesBefore,
    bytesAfter,
    rows,
  };
}
