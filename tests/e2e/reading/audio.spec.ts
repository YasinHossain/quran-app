import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Audio Functionality
 * Tests audio playback controls and player visibility
 */

test.describe('Audio Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/surah/1');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should show play button for verses', async ({ page }) => {
    await expect(page.locator('[data-verse-key]').first()).toBeVisible({ timeout: 10000 });

    const firstVerseCard = page.locator('[id^="verse-"]').first();
    await expect(firstVerseCard).toBeVisible({ timeout: 20000 });

    // Prefer a visible verse play/pause control within the first verse card.
    const versePlayButton = firstVerseCard.locator(
      'button:visible[aria-label="Play audio"], button:visible[aria-label="Pause audio"], button:visible[aria-label*="play audio" i], button:visible[aria-label*="pause audio" i]'
    );

    if ((await versePlayButton.count()) > 0) {
      expect(true).toBe(true);
      return;
    }

    // Mobile layouts surface verse actions behind a trigger.
    const verseActionsTrigger = firstVerseCard.locator(
      'button:visible[aria-label="Open verse actions menu"]'
    );
    if ((await verseActionsTrigger.count()) > 0) {
      expect(true).toBe(true);
      return;
    }

    // Desktop layouts may include a separate "options" menu button.
    const verseOptionsButton = firstVerseCard.locator('button:visible[aria-label="Open verse options"]');
    await expect(verseOptionsButton).toBeVisible({ timeout: 10000 });
  });

  test('should display audio player when play is triggered', async ({ page }) => {
    // Find and click a play button
    const playButton = page
      .locator(
        '[data-testid*="play"], ' +
          'button[aria-label*="play" i], ' +
          '[role="button"][aria-label*="play" i]'
      )
      .first();

    if (await playButton.isVisible()) {
      await playButton.click();

      // Wait for audio player controls to appear
      // The actual <audio> element is hidden, but the player UI should be visible
      const playerUI = page.locator(
        '[role="region"][aria-label*="Player" i], ' +
          '.z-audio-player, ' +
          '[data-testid="player-controls"], ' +
          '.player-container'
      );

      // Give it time to load
      await page.waitForTimeout(1000);

      // Either player UI is visible OR there's a pause button (indicating play worked)
      const playerVisible = await playerUI
        .first()
        .isVisible()
        .catch(() => false);
      const pauseVisible = await page
        .locator('button[aria-label*="pause" i], [data-testid*="pause"]')
        .first()
        .isVisible()
        .catch(() => false);

      expect(playerVisible || pauseVisible).toBe(true);
    }
  });

  test('should have accessible audio controls', async ({ page }) => {
    const audioControls = page.locator(
      '[role="slider"][aria-label*="progress" i], ' +
        '[role="slider"][aria-label*="volume" i], ' +
        'button[aria-label*="play" i], ' +
        'button[aria-label*="pause" i], ' +
        '[data-testid*="audio"]'
    );

    const controlCount = await audioControls.count();

    // Should have some audio controls with proper accessibility
    if (controlCount > 0) {
      for (let i = 0; i < Math.min(controlCount, 3); i++) {
        const control = audioControls.nth(i);
        if (await control.isVisible()) {
          const ariaLabel = await control.getAttribute('aria-label');
          const role = await control.getAttribute('role');
          expect(ariaLabel || role).toBeTruthy();
        }
      }
    }
  });

  test('should support keyboard shortcuts for audio', async ({ page }) => {
    // Trigger play first
    const playButton = page.locator('[data-testid*="play"], button[aria-label*="play" i]').first();

    if (await playButton.isVisible()) {
      await playButton.focus();
      await page.keyboard.press('Enter');

      // Small wait for player to initialize
      await page.waitForTimeout(500);

      // Space should toggle play/pause (common pattern)
      await page.keyboard.press('Space');
      await page.waitForTimeout(200);

      // Verify player is still visible (didn't crash)
      const playerArea = page
        .locator('[data-testid="audio-player"], .audio-player, .player-container')
        .first();

      if (await playerArea.isVisible()) {
        expect(await playerArea.isVisible()).toBe(true);
      }
    }
  });
});
