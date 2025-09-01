import type { NextConfig } from 'next';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextPwa = require('next-pwa');
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
  // Expose the Quran API base URL to the app
  env: {
    QURAN_API_BASE_URL: process.env.QURAN_API_BASE_URL,
  },

  outputFileTracingExcludes:
    process.env.NODE_ENV === 'production' ? { '*': ['app/(dev)/**'] } : undefined,

  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/wikipedia/commons/**',
      },
      {
        protocol: 'https',
        hostname: 'api.wikimedia.org',
        port: '',
        pathname: '/core/v1/commons/**',
      },
    ],
  },

  // Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

const withPWA = nextPwa(pwaConfig) as (config: NextConfig) => NextConfig;

export default withPWA(nextConfig);
