/**
 * One-off maintenance: shrink review photos that were stored at full
 * resolution, before uploads were capped.
 *
 * There is a one-click equivalent in the admin dashboard (Orders -> Shrink
 * review photos), which needs no local setup and already has the database
 * credentials. Prefer that. This exists for running it from a machine with a
 * checkout, and shares the same implementation.
 *
 * Safe to re-run: rows already small enough are skipped.
 *
 * Usage (macOS/Linux):
 *   DATABASE_URL='postgres://...' npx tsx scripts/shrink-review-photos.mts
 *   DATABASE_URL='postgres://...' npx tsx scripts/shrink-review-photos.mts --apply
 *
 * Usage (Windows PowerShell):
 *   $env:DATABASE_URL='postgres://...'; npx tsx scripts/shrink-review-photos.mts
 *
 * Without --apply it only reports what it would do.
 */
import { shrinkStoredReviewPhotos } from "../lib/shrink-review-photos";

const apply = process.argv.includes("--apply");

if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.error("Set DATABASE_URL (or POSTGRES_URL) before running this.");
  process.exit(1);
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(0)}KB`;

const result = await shrinkStoredReviewPhotos({ apply });

console.log(
  `${result.photos} review(s) with a photo. ${apply ? "Applying changes." : "Dry run - pass --apply to write."}\n`
);

for (const row of result.rows) {
  switch (row.action) {
    case "rewritten":
    case "would-rewrite":
      console.log(
        `#${row.id}: ${kb(row.beforeBytes)} -> ${kb(row.afterBytes)} ` +
          `(saves ${kb(row.beforeBytes - row.afterBytes)})${row.action === "would-rewrite" ? " [not written]" : ""}`
      );
      break;
    case "skipped-small":
      console.log(`#${row.id}: ${kb(row.beforeBytes)} already small, skipped`);
      break;
    case "skipped-undecodable":
      console.log(`#${row.id}: could not decode, left untouched`);
      break;
    case "skipped-malformed":
      console.log(`#${row.id}: not a base64 data URL, skipped`);
      break;
  }
}

const saved = result.bytesBefore - result.bytesAfter;
const pct = ((saved / Math.max(result.bytesBefore, 1)) * 100).toFixed(0);
console.log(
  `\nTotal decoded photo bytes: ${kb(result.bytesBefore)} -> ${kb(result.bytesAfter)} (${pct}% smaller)`
);
console.log(
  apply ? `${result.rewritten} row(s) rewritten.` : "No rows written (dry run)."
);
