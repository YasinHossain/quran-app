const pwaConfig = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || process.env.NEXT_DISABLE_PWA === 'true',
  // Prevent very large optional assets from being precached at install time.
  // Note: Each glob needs a leading `!` to be treated as an exclude.
  publicExcludes: ['!fonts/quran/**/*'],
  fallbacks: {
    document: '/offline',
  },
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      // Quran API caching (QDC + V4 + optional proxy) - these endpoints are effectively immutable.
      {
        urlPattern:
          /^https:\/\/api\.(?:quran\.com\/api\/v4|qurancdn\.com\/api\/qdc)\/(chapters|juzs|verses|resources|audio)(?:\/|\?|$)/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        urlPattern:
          /^https?:\/\/[^/]+\/api\/quran\/(chapters|juzs|verses|resources|audio)(?:\/|\?|$)/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // Audio caching strategy for Quran recitations
      {
        // Important: avoid caching audio via the service worker.
        // Caching + range slicing can cause playback failures on mobile after a few verse segments.
        urlPattern: /^https:\/\/.*\.(?:mp3|ogg|wav|m4a)$/,
        handler: 'NetworkOnly',
      },
      // Archive.org audio caching (common Quran audio source)
      {
        urlPattern: /^https:\/\/archive\.org\/.*\.mp3$/,
        handler: 'NetworkOnly',
      },
      // Per-page mushaf fonts (large): cache on-demand, but keep a cap to avoid ballooning storage.
      {
        urlPattern: /^\/fonts\/quran\/.*\.(?:woff2?|ttf|otf)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'quran-font-cache',
          expiration: {
            maxEntries: 80,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      // UI + non-Quran fonts
      {
        urlPattern: /^\/fonts\/.*\.(?:woff2?|ttf|otf)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'font-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
};

export default pwaConfig;
