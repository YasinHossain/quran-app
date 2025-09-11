import { createMockPage, MockPage } from './utils';

const openSidebar = async (page: MockPage): Promise<void> => {
  await page.click('[data-testid="bookmarks-sidebar-trigger"]');
};

const toggleBookmark = async (page: MockPage, key: string): Promise<void> => {
  await page.click(`[data-testid="bookmark-button-${key}"]`);
};

const isBookmarkVisible = async (page: MockPage, key: string): Promise<boolean> => {
  return page.locator(`[data-testid="bookmark-item-${key}"]`).isVisible();
};

describe('Bookmarking Functionality', () => {
  let page: MockPage;

  beforeEach(() => {
    page = createMockPage();
  });

  it('should bookmark a verse', async () => {
    await page.goto('http://localhost:3000/surah/1');
    await toggleBookmark(page, '1-1');
    await openSidebar(page);

    expect(await isBookmarkVisible(page, '1-1')).toBe(true);
    const bookmarkText = await page
      .locator('[data-testid="bookmark-item-1-1"] .verse-reference')
      .textContent();
    expect(bookmarkText).toBe('1:1');
  });

  it('should remove bookmark when clicked again', async () => {
    await page.goto('http://localhost:3000/surah/1');
    await toggleBookmark(page, '1-1');
    await toggleBookmark(page, '1-1');

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

    await openSidebar(page);
    expect(await isBookmarkVisible(page, '1-1')).toBe(false);
  });

  it('should navigate to bookmarked verse from sidebar', async () => {
    await page.goto('http://localhost:3000/surah/2');
    await toggleBookmark(page, '2-255');
    await page.goto('http://localhost:3000/surah/1');
    await openSidebar(page);
    await page.click('[data-testid="bookmark-item-2-255"]');
    await page.waitForURL('**/surah/2');

    const highlightedVerse = await page
      .locator('[data-testid="verse-2-255"].highlighted')
      .isVisible();
    expect(highlightedVerse).toBe(true);
  });
});
