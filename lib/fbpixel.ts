// Meta ads prohibit peptides, so Armoda Labs has no pixel and the tracking
// path is inert by default: empty ID => MetaPixel renders nothing and the
// Conversions API short-circuits. The old Rock Mountain pixel was removed
// outright rather than replaced — leaving it in sent Armoda traffic to
// another brand's analytics. Do not hardcode an ID here; if a compliant
// destination is ever approved, set NEXT_PUBLIC_FB_PIXEL_ID in the
// environment and the existing wiring resumes unchanged.
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? "";

/** True only when a pixel ID is configured. Gates every tracking call. */
export const isPixelConfigured = FB_PIXEL_ID.length > 0;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * @param eventId Dedup key shared with the server-side Conversions API event.
 *                Meta keeps whichever copy arrives first when both carry it.
 */
export function trackFbEvent(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window === "undefined") return;
  if (!isPixelConfigured) return;
  if (!window.fbq) {
    // The base snippet defines a queueing stub synchronously, so this only
    // happens if it hasn't executed yet or was blocked. Log rather than drop
    // silently - a missing Purchase is otherwise invisible.
    console.warn(`Meta Pixel not ready, event not sent: ${eventName}`);
    return;
  }
  if (eventId) {
    window.fbq("track", eventName, params, { eventID: eventId });
  } else {
    window.fbq("track", eventName, params);
  }
}

/** Reads a cookie in the browser; returns null on the server or if absent. */
export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}
