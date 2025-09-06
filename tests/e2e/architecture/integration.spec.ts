import { test, expect } from '@playwright/test';
import {
  testResponsiveDesign,
  testContextIntegration,
  testPerformanceOptimizations,
  testAccessibility,
} from './utils';

test.describe('🚀 End-to-End Integration', () => {
  test('Complete user journey with architecture compliance', async ({ page }) => {
    // 1. Home page load - responsive design
    await page.goto('/');
    await testResponsiveDesign(page, 'body');

    // 2. Navigation to surah - context integration
    await page.goto('/surah/1');
    await testContextIntegration(page);

    // 3. Reading experience - performance optimization
    await testPerformanceOptimizations(page);

    // 4. Bookmarking - state management
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
    if (await bookmarkButton.isVisible()) {
      await bookmarkButton.click();
      await expect(bookmarkButton).toHaveClass(/active|bookmarked/);
    }

    // 5. Audio playback - multimedia integration
    const playButton = page.locator('[data-testid="play-button"]').first();
    if (await playButton.isVisible()) {
      await playButton.click();
      await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();
    }

    // 6. Settings changes - reactive updates
    const settingsButton = page.locator('[data-testid="settings-button"]');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();

      const fontControl = page.locator('[data-testid="font-size-control"]');
      if (await fontControl.isVisible()) {
        await fontControl.selectOption('18');
      }
    }

    // 7. Mobile responsiveness - cross-device compatibility
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    await expect(page.locator('body')).toBeVisible();

    // 8. Accessibility - inclusive design
    await testAccessibility(page);
  });
});
