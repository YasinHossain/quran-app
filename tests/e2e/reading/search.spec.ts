import { createMockPage, MockPage } from './utils';

describe('Search Functionality', () => {
  let page: MockPage;

  beforeEach(() => {
    page = createMockPage();
  });

  it('should search for verses', async () => {
    await page.goto('http://localhost:3000');
    await page.click('[data-testid="search-input"]');
    await page.fill('[data-testid="search-input"]', 'Allah');
    await page.keyboard.press('Enter');
    await page.waitForURL('**/search?q=Allah');

    const searchResults = await page.locator('[data-testid="search-result"]').count();
    expect(searchResults).toBeGreaterThan(0);

    const firstResult = await page
      .locator('[data-testid="search-result"]:first-child .verse-text')
      .textContent();
    expect(firstResult?.toLowerCase()).toContain('allah');
  });

  it('should navigate to verse from search results', async () => {
    await page.goto('http://localhost:3000/search?q=Bismillah');
    await page.click('[data-testid="search-result"]:first-child');
    await page.waitForURL('**/surah/**');

    const highlightedVerse = await page.locator('.verse-card.highlighted').isVisible();
    expect(highlightedVerse).toBe(true);
  });
});
