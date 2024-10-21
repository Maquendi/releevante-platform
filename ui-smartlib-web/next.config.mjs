import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/config/i18n/request.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

export default withNextIntl(nextConfig);
