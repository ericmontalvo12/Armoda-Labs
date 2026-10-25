import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import {
  SITE_GATE_COOKIE,
  sitePassword,
  verifyGateToken,
} from "@/lib/site-gate";

/**
 * Two independent gates:
 *
 *  1. The pre-launch site gate, active only while SITE_PASSWORD is set.
 *  2. The admin dashboard and its APIs, always active.
 *
 * Admin paths skip the site gate - they already require a stronger
 * credential, so making a second password stand in front of them adds
 * nothing.
 */

/**
 * Paths that must stay reachable with no site-gate cookie.
 *
 * /api/webhook is the one that matters: Stripe delivers to it from its own
 * servers and cannot be handed a password. Gating it would silently drop
 * every order while the gate is up.
 */
function bypassesSiteGate(pathname: string): boolean {
  return (
    pathname === "/enter" ||
    pathname === "/api/site-auth" ||
    pathname === "/api/webhook" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin")
  );
}

async function adminGate(req: NextRequest, pathname: string) {
  // The login page and its endpoints must stay reachable, or there is no way in.
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return null;

  const authorized = await verifySessionToken(
    req.cookies.get(ADMIN_COOKIE)?.value
  );
  if (authorized) return NextResponse.next();

  // APIs get a JSON 401; pages get redirected to the login form.
  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  if (pathname !== "/admin") loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const admin = await adminGate(req, pathname);
  if (admin) return admin;

  const secret = sitePassword();
  if (!secret || bypassesSiteGate(pathname)) return NextResponse.next();

  const passed = await verifyGateToken(
    req.cookies.get(SITE_GATE_COOKIE)?.value,
    secret
  );
  if (passed) return NextResponse.next();

  // Anything non-page gets a flat 401 rather than an HTML redirect, so a
  // fetch from a gated page fails loudly instead of parsing a login page
  // as JSON.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gateUrl = new URL("/enter", req.url);
  if (pathname !== "/") gateUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  // Everything except Next's own static output and the files served from
  // public/. Without the file-extension exclusion the gate would also
  // redirect images and fonts, which breaks the gate page itself.
  matcher: ["/((?!_next/static|_next/image|.*\\.[\\w]+$).*)"],
};
