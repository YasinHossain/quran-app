import { test, expect } from '@playwright/test';
import { testResponsiveDesign } from './utils';

test.describe('📱 Mobile-First Responsive Design', () => {
  test('All components adapt correctly across breakpoints', async ({ page }) => {
    const testUrls = ['/surah/1', '/bookmarks', '/search', '/tafsir'];

    for (const url of testUrls) {
      await page.goto(url);
      await testResponsiveDesign(page, 'body');

      // Verify no horizontal scroll on mobile
      await page.setViewportSize({ width: 375, height: 812 });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
    }
  });

  test('Touch interactions work properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/surah/1');

    // Test touch-friendly verse actions
    const verseActionButton = page.locator('[data-testid="verse-action-button"]').first();
    if (await verseActionButton.isVisible()) {
      // Simulate touch interaction
      await verseActionButton.tap();

      // Verify action menu appears
      await expect(page.locator('[data-testid="verse-action-menu"]')).toBeVisible();

      // Test touch dismissal
      await page.tap('[data-testid="backdrop"]', { force: true });
      await expect(page.locator('[data-testid="verse-action-menu"]')).not.toBeVisible();
    }
  });

  test('Navigation adapts correctly for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/surah/1');

    // Mobile navigation should be accessible
    const mobileMenuTrigger = page.locator('[data-testid="mobile-menu-trigger"]');
    if (await mobileMenuTrigger.isVisible()) {
      await mobileMenuTrigger.tap();

      // Mobile menu should appear
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

      // Menu items should be touch-friendly
      const menuItems = page.locator('[data-testid="mobile-menu"] a, [data-testid="mobile-menu"] button');
      const count = await menuItems.count();

      for (let i = 0; i < Math.min(count, 3); i++) {
        const item = menuItems.nth(i);
        const box = await item.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44); // Touch-friendly height
        }
      }
    }
  });
});
