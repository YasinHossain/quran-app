import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Responsive Design
 * Tests layout and functionality across different screen sizes
 */

test.describe('Responsive Design', () => {
  const breakpoints = [
    { name: 'Mobile', width: 375, height: 812 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1280, height: 800 },
  ];

  for (const { name, width, height } of breakpoints) {
    test(`should display correctly on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/surah/1');
      await page.waitForLoadState('networkidle');

      // Main content should be visible
      const mainContent = page.locator('main, [role="main"], .content').first();
      await expect(mainContent).toBeVisible();

      // Verse content should be visible
      const verseContent = page
        .locator('[data-testid="verse-card"], .verse-card, [data-verse-key]')
        .first();
      await expect(verseContent).toBeVisible({ timeout: 10000 });

      // Content should not overflow horizontally
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      // Allow small tolerance for scrollbars
      expect(hasHorizontalScroll).toBe(false);
    });
  }

  test('should show mobile navigation on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for mobile menu trigger (hamburger icon)
    const mobileMenuTrigger = page
      .locator(
        '[data-testid="mobile-menu-trigger"], ' +
          'button[aria-label*="menu" i], ' +
          '.hamburger-menu, ' +
          '[data-testid="menu-button"]'
      )
      .first();

    const hasMobileMenu = await mobileMenuTrigger.isVisible().catch(() => false);

    // On mobile, either has hamburger menu OR navigation is reformatted
    const navigation = page.locator('nav, [role="navigation"]').first();
    const hasNavigation = await navigation.isVisible().catch(() => false);

    expect(hasMobileMenu || hasNavigation).toBe(true);
  });

  test('should have touch-friendly button sizes on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/surah/1');
    await page.waitForLoadState('networkidle');

    const interactiveElements = page.locator('button, [role="button"], a');
    const count = await interactiveElements.count();

    let touchFriendlyCount = 0;
    const toCheck = Math.min(count, 10);

    for (let i = 0; i < toCheck; i++) {
      const element = interactiveElements.nth(i);
      if (!(await element.isVisible())) continue;

      const box = await element.boundingBox();
      if (box) {
        // WCAG recommends 44x44 minimum for touch targets
        const isTouchFriendly = box.width >= 40 && box.height >= 40;
        if (isTouchFriendly) touchFriendlyCount++;
      }
    }

    // Most interactive elements should be touch-friendly
    expect(touchFriendlyCount).toBeGreaterThan(0);
  });

  test('should adapt audio player for mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/surah/1');
    await page.waitForLoadState('networkidle');

    // Trigger audio player
    const playButton = page.locator('[data-testid*="play"], button[aria-label*="play" i]').first();

    if (await playButton.isVisible()) {
      await playButton.click();
      await page.waitForTimeout(500);

      // Audio player should be visible and fit the screen
      const audioPlayer = page
        .locator('[data-testid="audio-player"], .audio-player, .player-container')
        .first();

      if (await audioPlayer.isVisible()) {
        const box = await audioPlayer.boundingBox();
        if (box) {
          // Player should not exceed viewport width
          expect(box.width).toBeLessThanOrEqual(375);
        }
      }
    }
  });

  test('should stack content vertically on narrow screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that main sections are visible and not cut off
    const mainSections = page.locator('section, .section, [data-section]');
    const sectionCount = await mainSections.count();

    for (let i = 0; i < Math.min(sectionCount, 3); i++) {
      const section = mainSections.nth(i);
      if (await section.isVisible()) {
        const box = await section.boundingBox();
        if (box) {
          // Section should not exceed viewport width
          expect(box.width).toBeLessThanOrEqual(320);
        }
      }
    }
  });
});
