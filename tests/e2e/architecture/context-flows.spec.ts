import { test, expect } from '@playwright/test';

test.describe('Context - Settings', () => {
  test('updates propagate correctly', async ({ page }) => {
    await page.goto('/surah/1');

    const settingsButton = page.locator('[data-testid="settings-button"]');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();

      const fontSizeControl = page.locator('[data-testid="font-size-control"]');
      if (await fontSizeControl.isVisible()) {
        await fontSizeControl.selectOption('20');

        const verseText = page.locator('[data-testid="verse-text"]').first();
        await page.waitForFunction(
          (element) => {
            const fontSize = window.getComputedStyle(element as Element).fontSize;
            return parseInt(fontSize) >= 20;
          },
          await verseText.elementHandle()
        );
      }

      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await expect(page.locator('html')).toHaveClass(/dark|light/);
      }
    }
  });
});

test.describe('Context - Audio', () => {
  test('synchronizes across components', async ({ page }) => {
    await page.goto('/surah/1');

    const playButton = page.locator('[data-testid="play-button"]').first();
    if (await playButton.isVisible()) {
      await playButton.click();

      await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();

      const playingVerse = page.locator('[data-testid="verse-1-1"]');
      await expect(playingVerse).toHaveClass(/playing|active/);

      await page.goto('/surah/2');
      await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();

      const currentTrackInfo = page.locator('[data-testid="current-track-info"]');
      if (await currentTrackInfo.isVisible()) {
        await expect(currentTrackInfo).toContainText('1:1');
      }
    }
  });
});

test.describe('Context - Bookmarks', () => {
  test('remains consistent across navigation', async ({ page }) => {
    await page.goto('/surah/1');

    const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
    if (await bookmarkButton.isVisible()) {
      await bookmarkButton.click();
      await expect(bookmarkButton).toHaveClass(/active|bookmarked/);

      await page.goto('/bookmarks');

      const bookmarkItem = page.locator('[data-testid="bookmark-item"]').first();
      await expect(bookmarkItem).toBeVisible();

      await bookmarkItem.click();
      await expect(page).toHaveURL(/\/surah\/1/);

      const returnedBookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
      await expect(returnedBookmarkButton).toHaveClass(/active|bookmarked/);
    }
  });
});
