declare module '@ducanh2912/next-pwa' {
  import type { NextConfig } from 'next';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type PWAConfig = Record<string, any>;

  export default function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}
