import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for E2E tests
 * Prepares the browser state for PWA and offline testing
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';

  console.log('🚀 Setting up E2E test environment...');

  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to app to trigger service worker registration
    console.log('📦 Pre-caching app for offline tests...');
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');

    // Visit key pages to populate cache
    const pagesToCache = ['/', '/surah/1', '/juz/1', '/bookmarks', '/search'];

    for (const path of pagesToCache) {
      try {
        await page.goto(`${baseURL}${path}`);
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        console.log(`✅ Cached: ${path}`);
      } catch (error) {
        console.log(`⚠️  Failed to cache: ${path}`, error);
      }
    }

    // Wait for service worker to be registered
    await page.waitForTimeout(2000);

    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          return registration !== undefined;
        } catch {
          return false;
        }
      }
      return false;
    });

    if (swRegistered) {
      console.log('✅ Service Worker registered successfully');
    } else {
      console.log('⚠️  Service Worker not registered');
    }

    console.log('🎯 E2E test environment ready');
  } catch (error) {
    console.error('❌ Failed to set up test environment:', error);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
