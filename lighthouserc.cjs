/**
 * Lighthouse CI configuration
 *
 * Purpose: provide a stable, automated performance regression signal in CI.
 * Notes:
 * - Uses Lighthouse's simulated throttling for better CI stability.
 * - Disables PWA during runs to avoid service worker/cache variability.
 * - Stores reports as artifacts (filesystem) rather than requiring an LHCI server.
 */

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'cross-env NEXT_DISABLE_PWA=true npm start -- -p 3000',
      startServerReadyPattern: 'started server',
      startServerReadyTimeout: 120000,
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/surah/1',
        'http://localhost:3000/surah/2',
        'http://localhost:3000/juz',
        'http://localhost:3000/bookmarks',
        'http://localhost:3000/search',
      ],
      numberOfRuns: 2,
      settings: {
        preset: 'desktop',
        throttlingMethod: 'simulate',
        onlyCategories: ['performance'],
        chromeFlags: ['--no-sandbox', '--disable-dev-shm-usage'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'audits:largest-contentful-paint': ['error', { maxNumericValue: 5000 }],
        'audits:cumulative-layout-shift': ['error', { maxNumericValue: 0.15 }],
        'audits:total-blocking-time': ['error', { maxNumericValue: 800 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: 'lighthouseci',
    },
  },
};
