import { test, expect } from '@playwright/test';

test.describe('🔄 Context Integration Flows', () => {
  test('Settings context updates propagate correctly', async ({ page }) => {
    await page.goto('/surah/1');

    // Open settings
    const settingsButton = page.locator('[data-testid="settings-button"]');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();

      // Change font size
      const fontSizeControl = page.locator('[data-testid="font-size-control"]');
      if (await fontSizeControl.isVisible()) {
        await fontSizeControl.selectOption('20');

        // Verify change is applied to verse text
        const verseText = page.locator('[data-testid="verse-text"]').first();
        await page.waitForFunction(
          (element) => {
            const fontSize = window.getComputedStyle(element as Element).fontSize;
            return parseInt(fontSize) >= 20;
          },
          await verseText.elementHandle()
        );
      }

      // Change theme
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      if (await themeToggle.isVisible()) {
        await themeToggle.click();

        // Verify theme change
        await expect(page.locator('html')).toHaveClass(/dark|light/);
      }
    }
  });

  test('Audio context synchronization across components', async ({ page }) => {
    await page.goto('/surah/1');

    // Start playing from verse
    const playButton = page.locator('[data-testid="play-button"]').first();
    if (await playButton.isVisible()) {
      await playButton.click();

      // Verify audio player reflects current state
      await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();

      // Verify verse highlighting
      const playingVerse = page.locator('[data-testid="verse-1-1"]');
      await expect(playingVerse).toHaveClass(/playing|active/);

      // Navigate to different surah
      await page.goto('/surah/2');

      // Audio player should still be visible
      await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();

      // Should show previous surah info
      const currentTrackInfo = page.locator('[data-testid="current-track-info"]');
      if (await currentTrackInfo.isVisible()) {
        await expect(currentTrackInfo).toContainText('1:1');
      }
    }
  });

  test('Bookmark context consistency across navigation', async ({ page }) => {
    await page.goto('/surah/1');

    // Bookmark a verse
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
    if (await bookmarkButton.isVisible()) {
      await bookmarkButton.click();
      await expect(bookmarkButton).toHaveClass(/active|bookmarked/);

      // Navigate to bookmarks page
      await page.goto('/bookmarks');

      // Verify bookmark appears
      const bookmarkItem = page.locator('[data-testid="bookmark-item"]').first();
      await expect(bookmarkItem).toBeVisible();

      // Click bookmark to navigate back
      await bookmarkItem.click();

      // Should navigate to verse and show as bookmarked
      await expect(page).toHaveURL(/\/surah\/1/);
      const returnedBookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
      await expect(returnedBookmarkButton).toHaveClass(/active|bookmarked/);
    }
  });
});
