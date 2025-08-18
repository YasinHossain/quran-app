import { test } from '@playwright/test';
import { compareScreenshot } from './utils';

const pages = [
  { route: '/', name: 'home' },
  { route: '/bookmarks', name: 'bookmarks' },
  { route: '/settings', name: 'settings' },
] as const;

for (const { route, name } of pages) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${name} ${theme} screenshot`, async ({ page }) => {
      await compareScreenshot(page, route, name, theme);
    });
  }
}
