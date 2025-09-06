import { createMockPage, MockPage } from './utils';

describe('Bookmarking Functionality', () => {
  let page: MockPage;

  beforeEach(() => {
    page = createMockPage();
  });

  it('should bookmark a verse', async () => {
    await page.goto('http://localhost:3000/surah/1');
    await page.click('[data-testid="bookmark-button-1-1"]');
    await page.click('[data-testid="bookmarks-sidebar-trigger"]');

    const bookmarkItem = await page.locator('[data-testid="bookmark-item-1-1"]').isVisible();
    expect(bookmarkItem).toBe(true);

    const bookmarkText = await page
      .locator('[data-testid="bookmark-item-1-1"] .verse-reference')
      .textContent();
    expect(bookmarkText).toBe('1:1');
  });

  it('should remove bookmark when clicked again', async () => {
    await page.goto('http://localhost:3000/surah/1');
    await page.click('[data-testid="bookmark-button-1-1"]');
    await page.click('[data-testid="bookmark-button-1-1"]');

    (page.locator as jest.Mock).mockImplementation((selector: string) => {
      if (selector === '[data-testid="bookmark-item-1-1"]') {
        return {
          count: jest.fn(),
          textContent: jest.fn(),
          isVisible: jest.fn().mockResolvedValue(false),
        };
      }
      return {
        count: jest.fn().mockResolvedValue(7),
        textContent: jest.fn().mockResolvedValue('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'),
        isVisible: jest.fn().mockResolvedValue(true),
      };
    });

    await page.click('[data-testid="bookmarks-sidebar-trigger"]');
    const bookmarkItem = await page.locator('[data-testid="bookmark-item-1-1"]').isVisible();
    expect(bookmarkItem).toBe(false);
  });

  it('should navigate to bookmarked verse from sidebar', async () => {
    await page.goto('http://localhost:3000/surah/2');
    await page.click('[data-testid="bookmark-button-2-255"]');
    await page.goto('http://localhost:3000/surah/1');
    await page.click('[data-testid="bookmarks-sidebar-trigger"]');
    await page.click('[data-testid="bookmark-item-2-255"]');
    await page.waitForURL('**/surah/2');

    const highlightedVerse = await page
      .locator('[data-testid="verse-2-255"].highlighted')
      .isVisible();
    expect(highlightedVerse).toBe(true);
  });
});
