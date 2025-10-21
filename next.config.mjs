import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const nextConfig = {
  experimental: {
    serverActions: true,
    typedRoutes: true,
  },
  i18n: {
    locales: ['en', 'fa'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
