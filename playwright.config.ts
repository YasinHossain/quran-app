import { defineConfig, devices } from '@playwright/test';

/**
 * @fileoverview Playwright Configuration for Architecture Compliance E2E Tests
 * @description Week 6 E2E testing setup with cross-browser and device testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/architecture-test-results.json' }],
    ['junit', { outputFile: 'test-results/architecture-junit.xml' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

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
      testMatch: '**/architecture-compliance.spec.ts',
    },
    
    {
      name: 'firefox-architecture',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: '**/architecture-compliance.spec.ts',
    },
    
    {
      name: 'webkit-architecture',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: '**/architecture-compliance.spec.ts',
    },

    /* Mobile Architecture Testing */
    {
      name: 'mobile-chrome-architecture',
      use: { 
        ...devices['Pixel 5'],
      },
      testMatch: '**/architecture-compliance.spec.ts',
    },
    
    {
      name: 'mobile-safari-architecture',
      use: { 
        ...devices['iPhone 12'],
      },
      testMatch: '**/architecture-compliance.spec.ts',
    },

    /* Regular E2E Tests */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: '**/architecture-compliance.spec.ts',
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: '**/architecture-compliance.spec.ts',
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: '**/architecture-compliance.spec.ts',
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      testIgnore: '**/architecture-compliance.spec.ts',
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      testIgnore: '**/architecture-compliance.spec.ts',
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run build && npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },
});
