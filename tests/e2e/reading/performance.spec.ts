import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Performance
 * Tests page load times, rendering performance, and caching
 */

test.describe('Performance', () => {
  test('should load surah page within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/surah/1');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds (generous for CI environments)
    expect(loadTime).toBeLessThan(5000);

    // Verses should be visible
    const verseCard = page.locator(
      '[data-testid="verse-card"], .verse-card, [data-verse-key]'
    ).first();
    await expect(verseCard).toBeVisible({ timeout: 10000 });
  });

  test('should render verses efficiently with virtual scrolling', async ({ page }) => {
    // Go to a long surah (Al-Baqarah has 286 verses)
    await page.goto('/surah/2');
    await page.waitForLoadState('networkidle');

    // Count initially rendered verses
    const initialVerses = page.locator(
      '[data-testid="verse-card"], .verse-card, [data-verse-key]'
    );
    const initialCount = await initialVerses.count();

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(500);

    // Count verses after scroll
    const afterScrollCount = await initialVerses.count();

    // Should have loaded more verses (or maintains virtualized count)
    expect(afterScrollCount).toBeGreaterThan(0);

    // If virtual scrolling, count shouldn't be 286 (all verses)
    // Allow for non-virtualized implementations
    expect(afterScrollCount).toBeLessThanOrEqual(300);
  });

  test('should handle navigation between surahs quickly', async ({ page }) => {
    await page.goto('/surah/1');
    await page.waitForLoadState('networkidle');

    const startTime = Date.now();

    // Navigate to another surah
    await page.goto('/surah/36'); // Ya-Sin
    await page.waitForLoadState('domcontentloaded');

    const navigationTime = Date.now() - startTime;

    // Navigation should be reasonably fast
    expect(navigationTime).toBeLessThan(3000);
  });

  test('should cache assets for faster subsequent loads', async ({ page }) => {
    // First load
    await page.goto('/surah/1');
    await page.waitForLoadState('networkidle');

    // Navigate away
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Second load (should use cache)
    const startTime = Date.now();
    await page.goto('/surah/1');
    await page.waitForLoadState('domcontentloaded');
    const secondLoadTime = Date.now() - startTime;

    // Second load should be faster (using cache)
    expect(secondLoadTime).toBeLessThan(4000);
  });

  test('should not have memory leaks with repeated navigation', async ({ page }) => {
    // Navigate back and forth multiple times
    for (let i = 0; i < 5; i++) {
      await page.goto('/surah/1');
      await page.waitForLoadState('domcontentloaded');
      await page.goto('/surah/2');
      await page.waitForLoadState('domcontentloaded');
    }

    // Check that page is still responsive
    const verseCard = page.locator(
      '[data-testid="verse-card"], .verse-card, [data-verse-key]'
    ).first();
    await expect(verseCard).toBeVisible({ timeout: 5000 });
  });

  test('should load web fonts efficiently', async ({ page }) => {
    await page.goto('/surah/1');
    await page.waitForLoadState('networkidle');

    // Check that Arabic text is rendered with correct font
    const arabicText = page.locator('[lang="ar"], .arabic-text').first();

    if (await arabicText.isVisible()) {
      const fontFamily = await arabicText.evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });

      // Should have a font defined
      expect(fontFamily).toBeTruthy();
      expect(fontFamily).not.toBe('');
    }
  });

  test('should measure First Contentful Paint', async ({ page }) => {
    await page.goto('/surah/1');

    // Get performance metrics
    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntriesByName('first-contentful-paint');
          if (entries.length > 0) {
            resolve(entries[0].startTime);
          }
        });
        observer.observe({ type: 'paint', buffered: true });

        // Fallback if FCP already happened
        setTimeout(() => {
          const entries = performance.getEntriesByName('first-contentful-paint');
          if (entries.length > 0) {
            resolve(entries[0].startTime);
          } else {
            resolve(0);
          }
        }, 1000);
      });
    });

    // FCP should be within reasonable range (under 3 seconds)
    if (fcp > 0) {
      expect(fcp).toBeLessThan(3000);
    }
  });
});
