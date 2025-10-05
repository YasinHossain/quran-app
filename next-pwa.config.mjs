const pwaConfig = {
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || process.env.NEXT_DISABLE_PWA === 'true',
  fallbacks: {
    document: '/offline',
  },
  runtimeCaching: [
    // API caching with network-first strategy
    {
      urlPattern:
        /^https:\/\/api\.quran\.com\/api\/v4\/(chapters|juzs|verses\/by_(chapter|juz|page))/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: { statuses: [0, 200] },
        networkTimeoutSeconds: 10,
      },
    },
    // Audio caching strategy for Quran recitations
    {
      urlPattern: /^https:\/\/.*\.(?:mp3|ogg|wav|m4a)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'audio-cache',
        expiration: {
          maxEntries: 50, // Cache up to 50 audio files
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
        cacheableResponse: { statuses: [0, 200] },
        rangeRequests: true, // Support audio seeking
      },
    },
    // Archive.org audio caching (common Quran audio source)
    {
      urlPattern: /^https:\/\/archive\.org\/.*\.mp3$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'archive-audio-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
        cacheableResponse: { statuses: [0, 200, 206] }, // Include 206 for range requests
        rangeRequests: true,
      },
    },
    // Font caching with long-term storage
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
    // Static assets caching
    {
      urlPattern: /^\/.*\.(js|css|png|jpg|jpeg|gif|webp|svg|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Google Fonts caching
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
};

export default pwaConfig;
