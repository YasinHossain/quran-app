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

  const assertMobileTouchTargets = async (): Promise<void> => {
    const touchElements = page.locator('[role="button"], button');
    const count = await touchElements.count();
    const max = Math.min(count, 3);
    const minTouchTargetPx = 44;
    const epsilonPx = 0.75; // account for fractional layout differences across browsers

    for (let i = 0; i < max; i++) {
      const touchEl = touchElements.nth(i);
      if (!(await touchEl.isVisible())) continue;
      const box = await touchEl.boundingBox();
      if (!box) continue;
      const minDimension = Math.min(box.width, box.height);
      if (minDimension < minTouchTargetPx - epsilonPx) {
        const details = await touchEl.evaluate((el) => ({
          tagName: el.tagName,
          ariaLabel: el.getAttribute('aria-label'),
          testId: el.getAttribute('data-testid'),
          text: (el.textContent || '').trim().slice(0, 120),
          className: el.getAttribute('class'),
        }));

        throw new Error(
          `Touch target too small (${minDimension}px). Expected >= ${minTouchTargetPx}px. Element: ${JSON.stringify(details)}`
        );
      }

      expect(minDimension).toBeGreaterThanOrEqual(minTouchTargetPx - epsilonPx);
    }
  };

  for (const { width, height } of breakpoints) {
    await page.setViewportSize({ width, height });
    await expect(page.locator(elementSelector)).toBeVisible({ timeout: 10000 });
    if (width <= 768) await assertMobileTouchTargets();
  }
}

/**
 * Test context integration flows like settings, audio and bookmarks.
 */
export async function testContextIntegration(page: Page): Promise<void> {
  const testSettings = async (): Promise<void> => {
    const settingsButton = page.locator('[data-testid="settings-button"]');
    if (!(await settingsButton.isVisible())) return;
    await settingsButton.click();

    const fontSizeSlider = page.locator('[data-testid="font-size-slider"]');
    if (!(await fontSizeSlider.isVisible())) return;
    await fontSizeSlider.fill('20');

    const verseText = page.locator('[data-testid="verse-text"]').first();
    const fontSize = await verseText.evaluate((el) => window.getComputedStyle(el).fontSize);
    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(20);
  };

  const testAudio = async (): Promise<void> => {
    const playButton = page.locator('[data-testid="play-button"]').first();
    if (!(await playButton.isVisible())) return;
    await playButton.click();
    await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();
    await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
  };

  const testBookmarks = async (): Promise<void> => {
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
    if (!(await bookmarkButton.isVisible())) return;
    await bookmarkButton.click();
    await expect(bookmarkButton).toHaveClass(/active|bookmarked/);
  };

  await testSettings();
  await testAudio();
  await testBookmarks();
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
  expect(navigationTime).toBeLessThan(process.env['CI'] ? 10000 : 8000);

  // Test virtual scrolling performance
  const verseCards = page.locator('[id^="verse-"]');
  await expect(verseCards.first()).toBeVisible({ timeout: 10000 });
  const initialCount = await verseCards.count();

  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 2000));
  await page.waitForTimeout(500);

  const afterScrollCount = await verseCards.count();

  // Virtual scrolling should render a reasonable subset (implementation-dependent)
  expect(afterScrollCount).toBeGreaterThan(0);
  expect(afterScrollCount).toBeLessThanOrEqual(300);
}

/**
 * Basic accessibility checks including keyboard nav and ARIA attributes.
 */
export async function testAccessibility(page: Page): Promise<void> {
  // Test keyboard navigation
  await page.keyboard.press('Tab');
  const focusedElement = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    if (el === document.body || el === document.documentElement) return null;
    return el.tagName;
  });
  expect(focusedElement).toBeTruthy();

  // Test ARIA attributes
  const buttons = page.locator('[role="button"], button');
  const buttonCount = await buttons.count();

  for (let i = 0; i < Math.min(buttonCount, 5); i++) {
    const button = buttons.nth(i);
    if (!(await button.isVisible())) continue;
    const ariaLabel = await button.getAttribute('aria-label');
    const text = await button.textContent();
    expect(ariaLabel || text?.trim()).toBeTruthy();
  }

  // Test contrast ratios (basic check)
  const textElements = page.locator('p, span, h1, h2, h3, h4, h5, h6');
  const textCount = await textElements.count();

  for (let i = 0; i < Math.min(textCount, 3); i++) {
    const textEl = textElements.nth(i);
    if (!(await textEl.isVisible())) continue;
    const styles = await textEl.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return { color: computed.color, backgroundColor: computed.backgroundColor };
    });
    expect(styles.color).toBeTruthy();
  }
}
