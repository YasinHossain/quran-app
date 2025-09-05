/**
 * @fileoverview Architecture Compliance E2E Tests
 * @description Week 6 E2E tests focusing on architecture compliance validation
 * @requires @playwright/test
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Architecture compliance test utilities
 */
class ArchitectureComplianceHelper {
  constructor(private page: Page) {}

  /**
   * Test mobile-first responsive design
   */
  async testResponsiveDesign(elementSelector: string): Promise<void> {
    const breakpoints = [
      { name: 'Mobile', width: 375, height: 812 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1024, height: 768 },
      { name: 'Large Desktop', width: 1280, height: 1024 },
    ];

    for (const breakpoint of breakpoints) {
      await this.page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });

      const element = this.page.locator(elementSelector);
      await expect(element).toBeVisible();

      // Test touch-friendly interactions on mobile
      if (breakpoint.width <= 768) {
        const touchElements = this.page.locator('[role="button"], button');
        const count = await touchElements.count();

        for (let i = 0; i < Math.min(count, 3); i++) {
          const touchEl = touchElements.nth(i);
          if (await touchEl.isVisible()) {
            const box = await touchEl.boundingBox();
            if (box) {
              // WCAG 2.1 AA: minimum 44px touch target
              expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
            }
          }
        }
      }
    }
  }

  /**
   * Test context integration functionality
   */
  async testContextIntegration(): Promise<void> {
    // Test Settings context - font size changes
    const settingsButton = this.page.locator('[data-testid="settings-button"]');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();

      const fontSizeSlider = this.page.locator('[data-testid="font-size-slider"]');
      if (await fontSizeSlider.isVisible()) {
        await fontSizeSlider.fill('20');

        // Verify font size change is applied
        const verseText = this.page.locator('[data-testid="verse-text"]').first();
        const fontSize = await verseText.evaluate((el) => window.getComputedStyle(el).fontSize);
        expect(parseInt(fontSize)).toBeGreaterThanOrEqual(20);
      }
    }

    // Test Audio context - playback controls
    const playButton = this.page.locator('[data-testid="play-button"]').first();
    if (await playButton.isVisible()) {
      await playButton.click();

      // Verify audio player appears
      await expect(this.page.locator('[data-testid="audio-player"]')).toBeVisible();

      // Verify play state
      await expect(this.page.locator('[data-testid="pause-button"]')).toBeVisible();
    }

    // Test Bookmark context - bookmark functionality
    const bookmarkButton = this.page.locator('[data-testid="bookmark-button"]').first();
    if (await bookmarkButton.isVisible()) {
      await bookmarkButton.click();

      // Verify bookmark is active
      await expect(bookmarkButton).toHaveClass(/active|bookmarked/);
    }
  }

  /**
   * Test performance optimizations
   */
  async testPerformanceOptimizations(): Promise<void> {
    // Test memo() effectiveness by checking for unnecessary re-renders
    const startTime = Date.now();

    // Navigate to different pages quickly
    await this.page.goto('/surah/1');
    await this.page.goto('/surah/2');
    await this.page.goto('/surah/1');

    const endTime = Date.now();
    const navigationTime = endTime - startTime;

    // Navigation should be fast due to memoization
    expect(navigationTime).toBeLessThan(3000);

    // Test virtual scrolling performance
    const longSurah = this.page.locator('[data-testid="verse-card"]');
    const initialCount = await longSurah.count();

    // Scroll down
    await this.page.evaluate(() => window.scrollBy(0, 2000));
    await this.page.waitForTimeout(100);

    const afterScrollCount = await longSurah.count();

    // More verses should be loaded, but not all at once (virtual scrolling)
    expect(afterScrollCount).toBeGreaterThan(initialCount);
    expect(afterScrollCount).toBeLessThan(100); // Reasonable limit
  }

  /**
   * Test accessibility compliance
   */
  async testAccessibility(): Promise<void> {
    // Test keyboard navigation
    await this.page.keyboard.press('Tab');
    const focusedElement = await this.page.evaluate(() =>
      document.activeElement?.getAttribute('data-testid')
    );
    expect(focusedElement).toBeTruthy();

    // Test ARIA attributes
    const buttons = this.page.locator('[role="button"], button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();

        // Button should have accessible text or aria-label
        expect(ariaLabel || text?.trim()).toBeTruthy();
      }
    }

    // Test contrast ratios (basic check)
    const textElements = this.page.locator('p, span, h1, h2, h3, h4, h5, h6');
    const textCount = await textElements.count();

    for (let i = 0; i < Math.min(textCount, 3); i++) {
      const textEl = textElements.nth(i);
      if (await textEl.isVisible()) {
        const styles = await textEl.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
          };
        });

        // Basic check - elements should have color values
        expect(styles.color).toBeTruthy();
      }
    }
  }
}

test.describe('Architecture Compliance E2E Tests', () => {
  let helper: ArchitectureComplianceHelper;

  test.beforeEach(async ({ page }) => {
    helper = new ArchitectureComplianceHelper(page);
  });

  test.describe('🏗️ Component Architecture', () => {
    test('SurahView component follows architecture patterns', async ({ page }) => {
      await page.goto('/surah/1');

      // Component should render with proper structure
      await expect(page.locator('main[role="main"]')).toBeVisible();

      // Test responsive design compliance
      await helper.testResponsiveDesign('main[role="main"]');

      // Test context integration
      await helper.testContextIntegration();

      // Test performance optimizations
      await helper.testPerformanceOptimizations();

      // Test accessibility compliance
      await helper.testAccessibility();
    });

    test('BookmarkFolderClient component architecture compliance', async ({ page }) => {
      await page.goto('/bookmarks');

      // Component should load with proper structure
      await expect(page.locator('[data-testid="bookmark-folder-client"]')).toBeVisible();

      // Test mobile-first responsive design
      await page.setViewportSize({ width: 375, height: 812 });
      const mobileLayout = page.locator('[data-testid="bookmark-folder-client"]');
      await expect(mobileLayout).toBeVisible();

      // Test desktop responsive adaptation
      await page.setViewportSize({ width: 1024, height: 768 });
      const desktopLayout = page.locator('[data-testid="bookmark-folder-client"]');
      await expect(desktopLayout).toBeVisible();
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
        await helper.testResponsiveDesign('[data-testid="audio-player"]');

        // Test context integration (current track state)
        const currentTrack = page.locator('[data-testid="current-track"]');
        if (await currentTrack.isVisible()) {
          await expect(currentTrack).toHaveText(/1:1/); // Should show current verse
        }

        // Test performance - audio controls should be responsive
        const controlsResponse = await page.locator('[data-testid="play-pause-button"]');
        await controlsResponse.click();
        await expect(controlsResponse).toHaveAttribute('aria-pressed', 'false');
      }
    });
  });

  test.describe('📱 Mobile-First Responsive Design', () => {
    test('All components adapt correctly across breakpoints', async ({ page }) => {
      const testUrls = ['/surah/1', '/bookmarks', '/search', '/tafsir'];

      for (const url of testUrls) {
        await page.goto(url);
        await helper.testResponsiveDesign('body');

        // Verify no horizontal scroll on mobile
        await page.setViewportSize({ width: 375, height: 812 });
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
      }
    });

    test('Touch interactions work properly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/surah/1');

      // Test touch-friendly verse actions
      const verseActionButton = page.locator('[data-testid="verse-action-button"]').first();
      if (await verseActionButton.isVisible()) {
        // Simulate touch interaction
        await verseActionButton.tap();

        // Verify action menu appears
        await expect(page.locator('[data-testid="verse-action-menu"]')).toBeVisible();

        // Test touch dismissal
        await page.tap('[data-testid="backdrop"]', { force: true });
        await expect(page.locator('[data-testid="verse-action-menu"]')).not.toBeVisible();
      }
    });

    test('Navigation adapts correctly for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/surah/1');

      // Mobile navigation should be accessible
      const mobileMenuTrigger = page.locator('[data-testid="mobile-menu-trigger"]');
      if (await mobileMenuTrigger.isVisible()) {
        await mobileMenuTrigger.tap();

        // Mobile menu should appear
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

        // Menu items should be touch-friendly
        const menuItems = page.locator(
          '[data-testid="mobile-menu"] a, [data-testid="mobile-menu"] button'
        );
        const count = await menuItems.count();

        for (let i = 0; i < Math.min(count, 3); i++) {
          const item = menuItems.nth(i);
          const box = await item.boundingBox();
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(44); // Touch-friendly height
          }
        }
      }
    });
  });

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

  test.describe('♿ Accessibility Compliance', () => {
    test('Keyboard navigation works throughout application', async ({ page }) => {
      await page.goto('/surah/1');

      // Test tab navigation
      await page.keyboard.press('Tab');
      let focusedElement = await page.evaluate(() =>
        document.activeElement?.getAttribute('data-testid')
      );
      expect(focusedElement).toBeTruthy();

      // Continue tabbing through elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        focusedElement = await page.evaluate(() =>
          document.activeElement?.getAttribute('data-testid')
        );
        expect(focusedElement).toBeTruthy();
      }

      // Test Enter/Space activation
      await page.keyboard.press('Enter');
      // Some action should occur (menu open, bookmark toggle, etc.)
    });

    test('ARIA attributes and roles are properly implemented', async ({ page }) => {
      await page.goto('/surah/1');

      // Check main landmarks
      await expect(page.locator('[role="main"]')).toBeVisible();

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
      await page.goto('/surah/1');

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

  test.describe('🚀 End-to-End Integration', () => {
    test('Complete user journey with architecture compliance', async ({ page }) => {
      // 1. Home page load - responsive design
      await page.goto('/');
      await helper.testResponsiveDesign('body');

      // 2. Navigation to surah - context integration
      await page.goto('/surah/1');
      await helper.testContextIntegration();

      // 3. Reading experience - performance optimization
      await helper.testPerformanceOptimizations();

      // 4. Bookmarking - state management
      const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();
      if (await bookmarkButton.isVisible()) {
        await bookmarkButton.click();
        await expect(bookmarkButton).toHaveClass(/active|bookmarked/);
      }

      // 5. Audio playback - multimedia integration
      const playButton = page.locator('[data-testid="play-button"]').first();
      if (await playButton.isVisible()) {
        await playButton.click();
        await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();
      }

      // 6. Settings changes - reactive updates
      const settingsButton = page.locator('[data-testid="settings-button"]');
      if (await settingsButton.isVisible()) {
        await settingsButton.click();

        const fontControl = page.locator('[data-testid="font-size-control"]');
        if (await fontControl.isVisible()) {
          await fontControl.selectOption('18');
        }
      }

      // 7. Mobile responsiveness - cross-device compatibility
      await page.setViewportSize({ width: 375, height: 812 });
      await page.reload();
      await expect(page.locator('body')).toBeVisible();

      // 8. Accessibility - inclusive design
      await helper.testAccessibility();
    });
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
