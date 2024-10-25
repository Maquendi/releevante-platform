import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/config/i18n/request.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Esto permite cualquier dominio
      },
    ],
  },
};

export default withNextIntl(nextConfig);
