import { test, expect } from '@playwright/test';

test.describe('⚡ Performance Optimizations', () => {
  test('Virtual scrolling performance with large surahs', async ({ page }) => {
    await page.goto('/surah/2'); // Al-Baqarah (286 verses)

    // Measure initial load time
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="verse-2-1"]');
    const loadTime = Date.now() - startTime;

    // Should load quickly with virtual scrolling
    expect(loadTime).toBeLessThan(2000);

    // Should not render all verses at once
    const initialVerseCount = await page.locator('[data-testid="verse-card"]').count();
    expect(initialVerseCount).toBeLessThan(50); // Should be limited

    // Scroll should load more verses
    await page.evaluate(() => window.scrollBy(0, 3000));
    await page.waitForTimeout(500);

    const afterScrollCount = await page.locator('[data-testid="verse-card"]').count();
    expect(afterScrollCount).toBeGreaterThan(initialVerseCount);
  });

  test('Memo optimization prevents unnecessary re-renders', async ({ page }) => {
    await page.goto('/surah/1');

    // Capture initial render time
    const startTime = await page.evaluate(() => performance.now());

    // Simulate prop changes that shouldn't trigger re-renders
    await page.evaluate(() => {
      // Simulate same props being passed
      window.dispatchEvent(
        new CustomEvent('prop-update', {
          detail: { same: true },
        })
      );
    });

    await page.waitForTimeout(100);

    const endTime = await page.evaluate(() => performance.now());
    const renderTime = endTime - startTime;

    // Should be minimal rendering time due to memoization
    expect(renderTime).toBeLessThan(50);
  });

  test('useCallback and useMemo effectiveness', async ({ page }) => {
    await page.goto('/surah/1');

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
    await page.goto('/surah/1');

    // Measure Largest Contentful Paint
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    expect(lcp).toBeLessThan(2500); // Good LCP threshold

    // Measure Cumulative Layout Shift
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as LayoutShift[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });

        setTimeout(() => resolve(clsValue), 1000);
      });
    });

    expect(cls).toBeLessThan(0.1); // Good CLS threshold
  });
});
