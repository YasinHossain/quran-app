import { createMockPage, MockPage } from './utils';

describe('Performance and Loading', () => {
  let page: MockPage;

  beforeEach(() => {
    page = createMockPage();
  });

  it('should load verses progressively', async () => {
    await page.goto('http://localhost:3000/surah/2');
    await page.waitForSelector('[data-testid="verse-2-1"]');

    const loadingIndicator = await page.locator('[data-testid="verses-loading"]').isVisible();
    expect(loadingIndicator).toBe(true);

    await page.waitForSelector('[data-testid="verse-2-20"]');
  });

  it('should cache verses for offline access', async () => {
    await page.goto('http://localhost:3000/surah/1');
    await page.waitForSelector('[data-testid="verse-1-7"]');
    await page.goto('http://localhost:3000');
    await page.goto('http://localhost:3000/surah/1');

    const firstVerse = await page.locator('[data-testid="verse-1-1"]').isVisible();
    expect(firstVerse).toBe(true);
  });
});
