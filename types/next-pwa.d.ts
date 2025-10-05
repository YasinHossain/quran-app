declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  type WithPwaOptions = Record<string, unknown>;

  // next-pwa exports a function that returns a Next.js config enhancer
  const withPWA: (options?: WithPwaOptions) => (config: NextConfig) => NextConfig;

  export default withPWA;
}
