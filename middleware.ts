import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";

/**
 * Gates the admin dashboard and its APIs. Everything else - the storefront,
 * Stripe webhook, reviews API - is untouched.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page and its endpoint must stay reachable, or there is no way in.
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const authorised = await verifySessionToken(
    req.cookies.get(ADMIN_COOKIE)?.value
  );
  if (authorised) return NextResponse.next();

  // APIs get a JSON 401; pages get redirected to the login form.
  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  if (pathname !== "/admin") loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
