import { expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';

export async function cacheInitialContent(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const pathsToCache = ['/surah/1', '/juz/1'];

  for (const path of pathsToCache) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
  }

  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

export type OfflineNavigationResult = {
  linkCount: number;
  destinationTitle: string | null;
};

export async function attemptOfflineNavigation(
  page: Page,
  context: BrowserContext
): Promise<OfflineNavigationResult> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await context.setOffline(true);

  const navLinks = page.locator('nav a, [role="navigation"] a');
  const linkCount = await navLinks.count();
  let destinationTitle: string | null = null;

  if (linkCount > 0) {
    await navLinks.first().click();
    await page.waitForTimeout(1000);
    destinationTitle = await page.title();
  }

  return { linkCount, destinationTitle };
}

export async function expectAppShellStructure(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  const viewport = await page.viewportSize();
  expect(viewport).toBeTruthy();

  const bodyStyle = await page.locator('body').evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });

  expect(bodyStyle).not.toBe('rgba(0, 0, 0, 0)');
}
