import { test, expect } from '@playwright/test';

import {
  testResponsiveDesign,
  testContextIntegration,
  testPerformanceOptimizations,
  testAccessibility,
} from './utils';

test.describe('🏗️ Component Architecture', () => {
  test('SurahView component follows architecture patterns', async ({ page }) => {
    await page.goto('/surah/1');

    // Component should render with proper structure
    await expect(page.locator('main[role="main"]')).toBeVisible();

    // Shared architecture checks
    await testResponsiveDesign(page, 'main[role="main"]');
    await testContextIntegration(page);
    await testPerformanceOptimizations(page);
    await testAccessibility(page);
  });

  test('BookmarkFolderClient component architecture compliance', async ({ page }) => {
    await page.goto('/bookmarks');

    // Component should load with proper structure
    await expect(page.locator('[data-testid="bookmark-folder-client"]')).toBeVisible();

    // Responsive design checks
    await testResponsiveDesign(page, '[data-testid="bookmark-folder-client"]');
  });

  test('QuranAudioPlayer component performance and context integration', async ({ page }) => {
    await page.goto('/surah/1');

    // Start audio playback
    const playButton = page.locator('[data-testid="play-surah-button"]');
    if (await playButton.isVisible()) {
      await playButton.click();

      // Audio player should appear
      await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();

      // Test responsive audio controls
      await testResponsiveDesign(page, '[data-testid="audio-player"]');

      // Test context integration (current track state)
      const currentTrack = page.locator('[data-testid="current-track"]');
      if (await currentTrack.isVisible()) {
        await expect(currentTrack).toHaveText(/1:1/); // Should show current verse
      }

      // Test performance - audio controls should be responsive
      const controlsResponse = page.locator('[data-testid="play-pause-button"]');
      await controlsResponse.click();
      await expect(controlsResponse).toHaveAttribute('aria-pressed', 'false');
    }
  });
});
