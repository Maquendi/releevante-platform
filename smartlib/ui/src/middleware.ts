import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./config/i18n/routing";

const PROTECTED_ROUTES = ["/checkin", "/checkout", "/reviewcart"];
const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const pathWithoutLocale = pathname.replace(/^\/(?:en|es|fr)/, "");

  const token = req.cookies.get(process.env.AUTH_COOKIE!)?.value;
  const redirectUrl = new URL("/en/auth", req.url);
  redirectUrl.searchParams.set("redirect", pathname);

  if (PROTECTED_ROUTES.includes(pathWithoutLocale)) {
    if (!token) {
      return NextResponse.redirect(redirectUrl);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(en|es|fr)/:path*", "/checkin", "/checkout"],
};
