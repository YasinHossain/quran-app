import type { NextConfig } from "next";
import nextI18NextConfig from "./next-i18next.config.mjs";

// Define commonly recommended security headers
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
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
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // 4. Add allowed development origins for cross-origin requests
  allowedDevOrigins: ['https://3000-firebase-quran-app-v1-1753035302321.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev'],
};

export default nextConfig;
