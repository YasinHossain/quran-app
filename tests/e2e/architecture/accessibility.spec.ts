import { test, expect } from '@playwright/test';

import { gotoApp } from './utils';

test.describe('♿ Accessibility Compliance', () => {
  test('Keyboard navigation works throughout application', async ({ page }) => {
    await gotoApp(page, '/surah/1');
    // WebKit can ignore keyboard events unless the page has an active focus target.
    await page
      .locator('main')
      .click({ position: { x: 10, y: 10 }, timeout: 1500 })
      .catch(() => undefined);

    // Test tab navigation
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      if (el === document.body || el === document.documentElement) return null;
      return el.tagName;
    });
    expect(focusedElement).toBeTruthy();

    // Continue tabbing through elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        if (el === document.body || el === document.documentElement) return null;
        return el.tagName;
      });
      expect(focusedElement).toBeTruthy();
    }

    // Test Enter/Space activation
    await page.keyboard.press('Enter');
    // Some action should occur (menu open, bookmark toggle, etc.)
  });

  test('ARIA attributes and roles are properly implemented', async ({ page }) => {
    await gotoApp(page, '/surah/1');

    // Check main landmarks
    await expect(page.getByRole('main')).toBeVisible();

    // Check button roles and labels
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();

        // Button should have accessible name
        expect(ariaLabel || text?.trim()).toBeTruthy();
      }
    }

    // Check heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('Screen reader compatibility', async ({ page }) => {
    await gotoApp(page, '/surah/1');

    // Check that content is properly structured for screen readers
    const verseCards = page.locator('[data-testid="verse-card"]');
    const cardCount = await verseCards.count();

    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const card = verseCards.nth(i);

      // Should have accessible description
      const ariaDescribedBy = await card.getAttribute('aria-describedby');
      const ariaLabel = await card.getAttribute('aria-label');

      expect(ariaDescribedBy || ariaLabel).toBeTruthy();
    }
  });
});
