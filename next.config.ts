import type { NextConfig } from 'next';
import nextI18NextConfig from './next-i18next.config.mjs';
import nextPwa, { type PWAConfig } from 'next-pwa';
import pwaConfig from './next-pwa.config.mjs';

// Define commonly recommended security headers
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  // --- MERGED CONFIGURATIONS ---
  // 1. Add i18n configuration
  ...nextI18NextConfig,

  // 2. Expose the Quran API base URL to the app
  env: {
    QURAN_API_BASE_URL: process.env.QURAN_API_BASE_URL,
  },

  // 3. Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

const withPWA = nextPwa(pwaConfig as PWAConfig) as (config: NextConfig) => NextConfig;

export default withPWA(nextConfig);
