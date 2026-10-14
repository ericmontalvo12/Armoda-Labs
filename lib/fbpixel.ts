export const FB_PIXEL_ID = "1812986660081810";

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
