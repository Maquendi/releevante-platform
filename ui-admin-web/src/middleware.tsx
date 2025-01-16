import createIntlMiddleware from 'next-intl/middleware';
import { routing } from "./config/i18n/routing";

export default createIntlMiddleware(routing);

export const config = {
    matcher: ["/", "/(en|es|fr)/:path*"],
};