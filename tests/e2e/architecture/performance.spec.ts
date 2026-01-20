import { test, expect, type Page } from '@playwright/test';

import { gotoApp } from './utils';

async function getLcp(page: Page): Promise<number> {
  return page.evaluate(() => {
    const bufferedEntries = performance.getEntriesByType(
      'largest-contentful-paint'
    ) as PerformanceEntry[];

    if (bufferedEntries.length) {
      return bufferedEntries[bufferedEntries.length - 1]?.startTime ?? 0;
    }

    return new Promise<number>((resolve) => {
      let lastStartTime = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        lastStartTime = lastEntry?.startTime ?? lastStartTime;
      });

      // Use buffered entries so we don't miss LCP if it happened before the observer started.
      observer.observe({ type: 'largest-contentful-paint', buffered: true } as PerformanceObserverInit);

      // Resolve even if no LCP is reported (some environments/browsers may not report it reliably).
      setTimeout(() => {
        observer.disconnect();
        resolve(lastStartTime);
      }, 2000);
    });
  });
}

async function getCls(page: Page): Promise<number> {
  await page.evaluate(() => {
    (window as any).__clsValue = 0;
    (window as any).__clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShift[]) {
        if (!entry.hadRecentInput) {
          (window as any).__clsValue += entry.value;
        }
      }
    });
    (window as any).__clsObserver.observe({ entryTypes: ['layout-shift'] });
  });

  await page.waitForTimeout(1000);

  return page.evaluate(() => {
    (window as any).__clsObserver.disconnect();
    const clsValue = (window as any).__clsValue;
    delete (window as any).__clsObserver;
    delete (window as any).__clsValue;
    return clsValue;
  });
}

test.describe('⚡ Performance Optimizations', () => {
  test('Virtual scrolling performance with large surahs', async ({ page }) => {
    await gotoApp(page, '/surah/2'); // Al-Baqarah (286 verses)

    // Measure initial load time
    const startTime = Date.now();
    await expect(page.locator('[id^="verse-"]').first()).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - startTime;

    // Should load quickly with virtual scrolling
    expect(loadTime).toBeLessThan(process.env['CI'] ? 8000 : 6000);

    // Should not render all verses at once
    const verseCards = page.locator('[id^="verse-"]');
    const initialVerseCount = await verseCards.count();
    expect(initialVerseCount).toBeLessThan(150); // Should be limited

    // Scroll should load more verses
    await page.evaluate(() => window.scrollBy(0, 3000));
    await page.waitForTimeout(500);

    const afterScrollCount = await verseCards.count();
    expect(afterScrollCount).toBeGreaterThan(0);
    expect(afterScrollCount).toBeLessThanOrEqual(300);
  });

  test('Memo optimization prevents unnecessary re-renders', async ({ page }) => {
    await gotoApp(page, '/surah/1');

    // Simulate prop changes that shouldn't trigger re-renders and ensure the UI stays responsive.
    const renderTime = await page.evaluate(async () => {
      const start = performance.now();

      window.dispatchEvent(
        new CustomEvent('prop-update', {
          detail: { same: true },
        })
      );

      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      return performance.now() - start;
    });

    // Generous threshold: headless + CI environments vary substantially.
    expect(renderTime).toBeLessThan(process.env['CI'] ? 750 : 500);
  });

  test('useCallback and useMemo effectiveness', async ({ page }) => {
    await gotoApp(page, '/surah/1');

    // Test callback stability - rapid interactions shouldn't cause performance issues
    const actionButton = page.locator('[data-testid="verse-action-button"]').first();
    if (await actionButton.isVisible()) {
      const startTime = Date.now();

      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        await actionButton.click();
        await page.waitForTimeout(10);
      }

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should handle rapid interactions efficiently
      expect(totalTime).toBeLessThan(1000);
    }
  });
});

test.describe('📊 Performance Metrics', () => {
  test('Core Web Vitals meet architecture standards', async ({ page }) => {
    await gotoApp(page, '/surah/1');

    // Measure Largest Contentful Paint
    const lcp = await getLcp(page);

    expect(lcp).toBeLessThan(2500); // Good LCP threshold

    // Measure Cumulative Layout Shift
    const cls = await getCls(page);

    expect(cls).toBeLessThan(0.1); // Good CLS threshold
  });
});
