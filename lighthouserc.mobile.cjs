/**
 * Lighthouse CI (Mobile) configuration
 *
 * Purpose: provide a stable, automated mobile performance signal.
 * Notes:
 * - Uses Lighthouse's simulated throttling for stability and repeatability.
 * - Disables PWA during runs to avoid service worker/cache variability.
 * - Stores reports as artifacts (filesystem) rather than requiring an LHCI server.
 */

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'cross-env NEXT_DISABLE_PWA=true npm start -- -p 3000',
      startServerReadyPattern: 'Ready in|started server',
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
        throttlingMethod: 'simulate',
        onlyCategories: ['performance'],
        chromeFlags: ['--no-sandbox', '--disable-dev-shm-usage'],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: 'lighthouseci-mobile',
    },
  },
};
