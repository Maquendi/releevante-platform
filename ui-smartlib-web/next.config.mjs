import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/config/i18n/request.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permitir todos los dominios https
      },
      {
        protocol: 'http',
        hostname: '**', // Permitir todos los dominios http (opcional)
      }
    ],
  },
};

export default withNextIntl(nextConfig);
