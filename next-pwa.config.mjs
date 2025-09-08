const nextPwaConfig = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || process.env.NEXT_DISABLE_PWA === 'true',
  runtimeCaching: [
    {
      urlPattern:
        /^https:\/\/api\.quran\.com\/api\/v4\/(chapters|juzs|verses\/by_(chapter|juz|page))/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^\/fonts\/.*\.(?:woff2?|ttf|otf)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'font-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
};

export default nextPwaConfig;
