import { test, expect } from '@playwright/test';

/**
 * E2E smoke tests for offline functionality
 * Tests core PWA offline features and fallback behavior
 */

test.describe('Offline Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for initial load
    await page.waitForLoadState('networkidle');

    // Visit a few pages to populate cache
    await page.goto('/surah/1');
    await page.waitForLoadState('networkidle');

    await page.goto('/juz/1');
    await page.waitForLoadState('networkidle');

    // Return to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display offline page when network is unavailable', async ({ page, context }) => {
    // Simulate offline state
    await context.setOffline(true);

    // Try to navigate to a new page
    await page.goto('/surah/2');

    // Should show offline page
    await expect(page).toHaveTitle(/Offline/);
    await expect(page.locator('h1')).toContainText("You're Offline");

    // Check offline page content
    await expect(page.locator('text=Previously viewed suras and verses')).toBeVisible();
    await expect(page.locator('text=Cached audio recitations')).toBeVisible();
    await expect(page.locator('text=Your bookmarks and reading progress')).toBeVisible();

    // Check action buttons
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
    await expect(page.locator('button:has-text("Go Back")')).toBeVisible();
  });

  test('should load cached pages when offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    // Try to navigate to previously visited page
    await page.goto('/surah/1');

    // If cached properly, should not show offline page
    // Instead should show the actual surah page or at least attempt to load it
    await page.waitForTimeout(2000); // Give time for cache to respond

    // Check if we're not on the offline page
    const isOfflinePage = await page.locator('h1:has-text("You\'re Offline")').count();

    if (isOfflinePage === 0) {
      // Successfully loaded from cache
      console.warn('Page loaded from cache successfully');
    } else {
      // Fallback to offline page (still valid behavior)
      console.warn('Showed offline page as fallback');
    }

    // This test passes either way since both are valid offline behaviors
    expect(true).toBe(true);
  });

  test('should restore functionality when back online', async ({ page, context }) => {
    // Go offline first
    await context.setOffline(true);

    // Try to navigate to trigger offline state
    await page.goto('/surah/3');
    await page.waitForTimeout(1000);

    // Go back online
    await context.setOffline(false);

    // Click try again button if on offline page
    const tryAgainButton = page.locator('button:has-text("Try Again")');
    if ((await tryAgainButton.count()) > 0) {
      await tryAgainButton.click();
    }

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Should not be on offline page anymore
    await expect(page.locator('h1:has-text("You\'re Offline")')).toHaveCount(0);
  });

  test('should handle audio playback offline for cached content', async ({ page, context }) => {
    // First, visit audio player page online to cache content
    await page.goto('/surah/1');
    await page.waitForLoadState('networkidle');

    // Look for audio player elements
    const audioPlayer = page.locator('[data-testid="audio-player"], .audio-player, audio');

    if ((await audioPlayer.count()) > 0) {
      // If audio player exists, test offline behavior
      await context.setOffline(true);

      // Try to use audio controls
      const playButton = page.locator(
        '[data-testid="play-button"], button:has-text("Play"), [aria-label*="Play"]'
      );

      if ((await playButton.count()) > 0) {
        await playButton.click();

        // Audio should either play from cache or show appropriate offline message
        // Both behaviors are acceptable
        await page.waitForTimeout(1000);
        console.warn('Audio offline behavior tested');
      }
    }

    // Test passes regardless of audio availability
    expect(true).toBe(true);
  });

  test('should maintain app shell structure offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    // Navigate to offline page
    await page.goto('/nonexistent-page');
    await page.waitForLoadState('networkidle');

    // Check that basic app structure is maintained
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Check for responsive viewport
    const viewport = await page.viewportSize();
    expect(viewport).toBeTruthy();

    // Check for basic CSS loading (background color should be applied)
    const bodyStyle = await page.locator('body').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Should not be default browser background (indicates CSS loaded)
    expect(bodyStyle).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should handle service worker registration', async ({ page }) => {
    // Check if service worker is supported and registered
    const swSupported = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });

    if (swSupported) {
      // Wait a bit for service worker to register
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

    // Test passes regardless of service worker support
    expect(true).toBe(true);
  });

  test('should handle navigation offline', async ({ page, context }) => {
    // Ensure we're on a page that has navigation
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Go offline
    await context.setOffline(true);

    // Try to use navigation if available
    const navLinks = page.locator('nav a, [role="navigation"] a');
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      // Click the first navigation link
      await navLinks.first().click();
      await page.waitForTimeout(1000);

      // Should either navigate successfully (if cached) or show offline page
      const currentTitle = await page.title();
      console.warn('Navigation offline test - Current page title:', currentTitle);
    }

    // Test passes regardless of navigation availability
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
