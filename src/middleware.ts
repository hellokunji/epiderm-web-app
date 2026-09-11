import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIES } from "@/lib/auth/constants";

/**
 * Soft auth gate — cookie presence only.
 * JWT validity is owned by backend services; expired tokens are refreshed
 * by the API interceptor when a request returns 401.
 */
const AUTH_PAGES = new Set(["/login", "/signup"]);
const PUBLIC_PATHS = new Set(["/", "/login", "/signup"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const access = request.cookies.get(AUTH_COOKIES.access)?.value;
  const refresh = request.cookies.get(AUTH_COOKIES.refresh)?.value;
  const authenticated = Boolean(access || refresh);

  if (authenticated && AUTH_PAGES.has(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!PUBLIC_PATHS.has(pathname) && !authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
