import sharp from "sharp";

/**
 * Review photos are stored in Postgres as base64 data URLs. Base64 inflates
 * bytes by ~33%, so a 2MB phone photo becomes ~2.7MB of text in the database
 * and on every wire that carries it. Four full-resolution photos were enough
 * to push ~5.5MB through Neon per product page view and exhaust the project's
 * transfer allowance, which suspended the database.
 *
 * A review card renders the image at 144-192 CSS px, so anything beyond ~800px
 * is invisible detail. These caps put a typical photo under ~120KB.
 */
export const PHOTO_MAX_EDGE = 800;
export const PHOTO_QUALITY = 78;

/** Above this, a stored photo is treated as legacy and re-encoded on read. */
export const PHOTO_REENCODE_THRESHOLD_BYTES = 250 * 1024;

/**
 * Re-encodes an image to a web-sized WebP. Returns null if the input is not a
 * decodable image, so callers can reject it.
 */
export async function shrinkPhoto(
  input: Buffer
): Promise<{ body: Buffer; contentType: string } | null> {
  try {
    const body = await sharp(input)
      .rotate() // honour EXIF orientation before the metadata is stripped
      .resize({
        width: PHOTO_MAX_EDGE,
        height: PHOTO_MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: PHOTO_QUALITY })
      .toBuffer();
    return { body, contentType: "image/webp" };
  } catch {
    return null;
  }
}
