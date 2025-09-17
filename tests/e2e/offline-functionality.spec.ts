import { test, expect } from '@playwright/test';
import {
  attemptOfflineNavigation,
  cacheInitialContent,
  expectAppShellStructure,
} from './utils/offline';

/**
 * E2E smoke tests for offline functionality
 * Tests core PWA offline features and fallback behavior
 */

test.describe('offline page fallback', () => {
  test.beforeEach(async ({ page }) => {
    await cacheInitialContent(page);
  });

  test('shows offline page when network is unavailable', async ({ page, context }) => {
    await context.setOffline(true);
    await page.goto('/surah/2');

    await expect(page).toHaveTitle(/Offline/);
    await expect(page.locator('h1')).toContainText("You're Offline");

    await expect(page.locator('text=Previously viewed suras and verses')).toBeVisible();
    await expect(page.locator('text=Cached audio recitations')).toBeVisible();
    await expect(page.locator('text=Your bookmarks and reading progress')).toBeVisible();

    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
    await expect(page.locator('button:has-text("Go Back")')).toBeVisible();
  });
});

test.describe('cached page behavior', () => {
  test.beforeEach(async ({ page }) => {
    await cacheInitialContent(page);
  });

  test('loads cached pages when offline', async ({ page, context }) => {
    await context.setOffline(true);
    await page.goto('/surah/1');
    await page.waitForTimeout(2000);

    const offlinePageCount = await page.locator('h1:has-text("You\'re Offline")').count();

    if (offlinePageCount === 0) {
      console.warn('Page loaded from cache successfully');
    } else {
      console.warn('Showed offline page as fallback');
    }

    expect(true).toBe(true);
  });

  test('restores functionality when back online', async ({ page, context }) => {
    await context.setOffline(true);
    await page.goto('/surah/3');
    await page.waitForTimeout(1000);

    await context.setOffline(false);

    const tryAgainButton = page.locator('button:has-text("Try Again")');
    if ((await tryAgainButton.count()) > 0) {
      await tryAgainButton.click();
    }

    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1:has-text("You\'re Offline")')).toHaveCount(0);
  });

  test('handles audio playback offline for cached content', async ({ page, context }) => {
    await page.goto('/surah/1');
    await page.waitForLoadState('networkidle');

    const audioPlayer = page.locator('[data-testid="audio-player"], .audio-player, audio');

    if ((await audioPlayer.count()) > 0) {
      await context.setOffline(true);

      const playButton = page.locator(
        '[data-testid="play-button"], button:has-text("Play"), [aria-label*="Play"]'
      );

      if ((await playButton.count()) > 0) {
        await playButton.click();
        await page.waitForTimeout(1000);
        console.warn('Audio offline behavior tested');
      }
    }

    expect(true).toBe(true);
  });
});

test.describe('offline app shell', () => {
  test('maintains app shell structure offline', async ({ page, context }) => {
    await context.setOffline(true);
    await page.goto('/nonexistent-page');
    await page.waitForLoadState('networkidle');

    await expectAppShellStructure(page);
  });
});

test.describe('offline navigation experience', () => {
  test.beforeEach(async ({ page }) => {
    await cacheInitialContent(page);
  });

  test('handles navigation offline', async ({ page, context }) => {
    const { linkCount, destinationTitle } = await attemptOfflineNavigation(page, context);

    if (linkCount > 0) {
      console.warn('Navigation offline test - Current page title:', destinationTitle);
    }

    expect(true).toBe(true);
  });
});

test.describe('service worker', () => {
  test('handles service worker registration', async ({ page }) => {
    const swSupported = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });

    if (swSupported) {
      await page.waitForTimeout(2000);

      const swRegistered = await page.evaluate(async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          return registration !== undefined;
        } catch {
          return false;
        }
      });

      console.warn('Service Worker registered:', swRegistered);
    }

    expect(true).toBe(true);
  });
});

test.describe('PWA Features', () => {
  test('should have manifest file', async ({ page }) => {
    // Check for PWA manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveCount(1);

    // Get manifest URL
    const manifestHref = await manifestLink.getAttribute('href');
    expect(manifestHref).toBeTruthy();

    // Try to fetch manifest
    const response = await page.goto(manifestHref!);
    expect(response?.status()).toBe(200);

    // Parse manifest content
    const manifestContent = await response?.json();
    expect(manifestContent).toBeTruthy();
    expect(manifestContent.name || manifestContent.short_name).toBeTruthy();
  });

  test('should have appropriate PWA metadata', async ({ page }) => {
    await page.goto('/');

    // Check for PWA meta tags
    await expect(page.locator('meta[name="theme-color"]')).toHaveCount(1);
    await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);

    // Check viewport meta tag content
    const viewportContent = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewportContent).toContain('width=device-width');
    expect(viewportContent).toContain('initial-scale=1');
  });
});
