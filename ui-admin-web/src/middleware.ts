import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./config/i18n/routing";
import { API_CONFIG, API_COOKIE, isTokenValid } from "./lib/htttp/utils";

const PROTECTED_ROUTES = [
  "/checkin",
  "/checkout",
  "/reserved",
  "/rating/book",
  "/rating/service",
];
const PUBLIC_ROUTES = ["/auth/verify"];
const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const accessId = url.searchParams.get("access_id") || API_COOKIE?.ACCESS_ID()?.value
  const authToken = req.cookies.get(process.env.CLIENT_TOKEN!)?.value;
  const redirectUrl = new URL("/en/auth/verify", req.url);
  redirectUrl.searchParams.set("redirect_url", pathname);
  const pathWithoutLocale = pathname.replace(/^\/(?:en|es|fr)/, "");

  if (PUBLIC_ROUTES.some((route) => pathWithoutLocale.startsWith(route))) {
    return intlMiddleware(req);
  }

  if (accessId && !authToken) {
    redirectUrl.searchParams.set('access_id',accessId)
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(API_CONFIG.ACCESS_ID!, accessId!);
    return response;
  }

  const isAuthTokenValid = authToken ? isTokenValid(authToken) : false;

  if (
    PROTECTED_ROUTES.includes(pathWithoutLocale) &&
    !isAuthTokenValid &&
    !accessId
  ) {
    redirectUrl.pathname = '/en/auth/code'
    redirectUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(en|es|fr)/:path*", "/checkin", "/checkout", "/catalog","/reserved"],
};
