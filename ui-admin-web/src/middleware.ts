import createMiddleware from "next-intl/middleware";
import { routing } from "./config/i18n/routing";

export default createMiddleware(routing);

export const config = {
    matcher: ['/', '/(es|en|fr)/:path*']
  };