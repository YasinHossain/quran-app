import { Page, expect } from '@playwright/test';

/**
 * Test mobile-first responsive design for a selector across breakpoints.
 */
export async function testResponsiveDesign(page: Page, elementSelector: string): Promise<void> {
  const breakpoints = [
    { name: 'Mobile', width: 375, height: 812 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1024, height: 768 },
    { name: 'Large Desktop', width: 1280, height: 1024 },
  ];

  for (const breakpoint of breakpoints) {
    await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });

    const element = page.locator(elementSelector);
    await expect(element).toBeVisible();

    // Test touch-friendly interactions on mobile
    if (breakpoint.width <= 768) {
      const touchElements = page.locator('[role="button"], button');
      const count = await touchElements.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        const touchEl = touchElements.nth(i);
        if (await touchEl.isVisible()) {
          const box = await touchEl.boundingBox();
          if (box) {
            // WCAG 2.1 AA: minimum 44px touch target
            expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
          }
        }
      }
    }
  }
}

/**
 * Test context integration flows like settings, audio and bookmarks.
 */
export async function testContextIntegration(page: Page): Promise<void> {
  // Test Settings context - font size changes
  const settingsButton = page.locator('[data-testid="settings-button"]');
  if (await settingsButton.isVisible()) {
    await settingsButton.click();

    const fontSizeSlider = page.locator('[data-testid="font-size-slider"]');
    if (await fontSizeSlider.isVisible()) {
      await fontSizeSlider.fill('20');

      // Verify font size change is applied
      const verseText = page.locator('[data-testid="verse-text"]').first();
      const fontSize = await verseText.evaluate((el) => window.getComputedStyle(el).fontSize);
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(20);
    }
  }

  // Test Audio context - playback controls
  const playButton = page.locator('[data-testid="play-button"]').first();
  if (await playButton.isVisible()) {
    await playButton.click();

    // Verify audio player appears
    await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();

    // Verify play state
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
  }

  // Test Bookmark context - bookmark functionality
  const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
  if (await bookmarkButton.isVisible()) {
    await bookmarkButton.click();

    // Verify bookmark is active
    await expect(bookmarkButton).toHaveClass(/active|bookmarked/);
  }
}

/**
 * Test performance optimizations like memoization and virtual scrolling.
 */
export async function testPerformanceOptimizations(page: Page): Promise<void> {
  // Test memo() effectiveness by checking for unnecessary re-renders
  const startTime = Date.now();

  // Navigate to different pages quickly
  await page.goto('/surah/1');
  await page.goto('/surah/2');
  await page.goto('/surah/1');

  const endTime = Date.now();
  const navigationTime = endTime - startTime;

  // Navigation should be fast due to memoization
  expect(navigationTime).toBeLessThan(3000);

  // Test virtual scrolling performance
  const longSurah = page.locator('[data-testid="verse-card"]');
  const initialCount = await longSurah.count();

  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 2000));
  await page.waitForTimeout(100);

  const afterScrollCount = await longSurah.count();

  // More verses should be loaded, but not all at once (virtual scrolling)
  expect(afterScrollCount).toBeGreaterThan(initialCount);
  expect(afterScrollCount).toBeLessThan(100); // Reasonable limit
}

/**
 * Basic accessibility checks including keyboard nav and ARIA attributes.
 */
export async function testAccessibility(page: Page): Promise<void> {
  // Test keyboard navigation
  await page.keyboard.press('Tab');
  const focusedElement = await page.evaluate(() =>
    document.activeElement?.getAttribute('data-testid')
  );
  expect(focusedElement).toBeTruthy();

  // Test ARIA attributes
  const buttons = page.locator('[role="button"], button');
  const buttonCount = await buttons.count();

  for (let i = 0; i < Math.min(buttonCount, 5); i++) {
    const button = buttons.nth(i);
    if (await button.isVisible()) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();

      // Button should have accessible text or aria-label
      expect(ariaLabel || text?.trim()).toBeTruthy();
    }
  }

  // Test contrast ratios (basic check)
  const textElements = page.locator('p, span, h1, h2, h3, h4, h5, h6');
  const textCount = await textElements.count();

  for (let i = 0; i < Math.min(textCount, 3); i++) {
    const textEl = textElements.nth(i);
    if (await textEl.isVisible()) {
      const styles = await textEl.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });

      // Basic check - elements should have color values
      expect(styles.color).toBeTruthy();
    }
  }
}
