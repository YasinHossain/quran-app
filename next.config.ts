import { createRequire } from 'module';

import pwaConfig from './next-pwa.config.mjs';

import type { NextConfig } from 'next';

// next-pwa is a CJS module; use dynamic require and keep type loose
const loadWithPWA = createRequire(import.meta.url)('next-pwa') as typeof import('next-pwa').default;

// Define commonly recommended security headers
// Note: Avoid HSTS in development (can break Safari by forcing HTTPS on localhost)
// Content Security Policy for production
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https: blob:;
  media-src 'self' https: blob:;
  connect-src 'self' https://api.quran.com https://api.quran.gading.dev https://raw.githubusercontent.com https://archive.org;
  worker-src 'self' blob:;
  child-src 'self' blob:;
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const baseSecurityHeaders = [
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
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(self)',
  },
];

const isProd = process.env.NODE_ENV === 'production';
const securityHeaders = isProd
  ? [
      ...baseSecurityHeaders,
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'Content-Security-Policy',
        value: cspHeader,
      },
    ]
  : [
      ...baseSecurityHeaders,
      {
        key: 'Content-Security-Policy-Report-Only',
        value: cspHeader,
      },
    ];

const nextConfig: NextConfig = {
  // Expose the Quran API base URL to the app
  env: {
    QURAN_API_BASE_URL: process.env['QURAN_API_BASE_URL'],
  },

  ...(isProd
    ? { outputFileTracingExcludes: { '*': ['app/(dev)/**'] } as Record<string, string[]> }
    : {}),

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

const withPWA = loadWithPWA(pwaConfig);

export default withPWA(nextConfig);
