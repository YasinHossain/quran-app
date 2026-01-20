import { defineConfig, devices } from '@playwright/test';

/**
 * @fileoverview Playwright Configuration for E2E Tests
 * @description E2E testing setup with cross-browser, device, and offline testing
 * @see https://playwright.dev/docs/test-configuration
 */
// Use a dedicated port by default so local `npm run dev` on 3000 doesn't interfere with E2E.
const port =
  process.env['PLAYWRIGHT_PORT'] ?? (process.env['CI'] ? (process.env['PORT'] ?? '3000') : '3100');
const baseURL = `http://127.0.0.1:${port}`;

const webServerEnv: Record<string, string> = Object.fromEntries(
  Object.entries(process.env).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string'
  )
);

export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env['CI'],
  /* Retry on CI only */
  retries: process.env['CI'] ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  ...(process.env['CI'] ? { workers: 1 as number } : {}),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/architecture-test-results.json' }],
    ['junit', { outputFile: 'test-results/architecture-junit.xml' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for architecture compliance testing */
  projects: [
    /* Architecture Compliance Tests - Desktop Browsers */
    {
      name: 'chromium-architecture',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: '**/architecture/**/*.spec.ts',
    },

    {
      name: 'firefox-architecture',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: '**/architecture/**/*.spec.ts',
    },

    {
      name: 'webkit-architecture',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: '**/architecture/**/*.spec.ts',
    },

    /* Mobile Architecture Testing */
    {
      name: 'mobile-chrome-architecture',
      use: {
        ...devices['Pixel 5'],
      },
      testMatch: '**/architecture/**/*.spec.ts',
    },

    {
      name: 'mobile-safari-architecture',
      use: {
        ...devices['iPhone 12'],
      },
      testMatch: '**/architecture/**/*.spec.ts',
    },

    /* PWA & Offline Tests */
    {
      name: 'pwa-desktop',
      use: {
        ...devices['Desktop Chrome'],
        // Enable service worker for PWA testing
        serviceWorkers: 'allow',
        viewport: { width: 1280, height: 720 },
      },
      testMatch: '**/offline-functionality.spec.ts',
    },

    {
      name: 'pwa-mobile',
      use: {
        ...devices['Pixel 5'],
        serviceWorkers: 'allow',
      },
      testMatch: '**/offline-functionality.spec.ts',
    },

    /* Regular E2E Tests */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/architecture/**/*.spec.ts', '**/offline-functionality.spec.ts'],
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: ['**/architecture/**/*.spec.ts', '**/offline-functionality.spec.ts'],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: ['**/architecture/**/*.spec.ts', '**/offline-functionality.spec.ts'],
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      testIgnore: ['**/architecture/**/*.spec.ts', '**/offline-functionality.spec.ts'],
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      testIgnore: ['**/architecture/**/*.spec.ts', '**/offline-functionality.spec.ts'],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'node tools/scripts/playwright-webserver.mjs',
    url: baseURL,
    // Offline/PWA tests require a production build with a service worker.
    reuseExistingServer: false,
    timeout: 5 * 60 * 1000, // 5 minutes (Next build + start can be slow in CI/containers)
    env: {
      ...webServerEnv,
      PLAYWRIGHT_PORT: String(port),
      PLAYWRIGHT_HOST: '127.0.0.1',
      PLAYWRIGHT_TEST: 'true',
    },
  },
});
