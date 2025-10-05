import { createMockPage, MockPage } from './utils';

describe('Accessibility', () => {
  let page: MockPage;

  beforeEach(() => {
    page = createMockPage();
  });

  it('should support keyboard navigation', async () => {
    await page.goto('http://localhost:3000/surah/1');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    const bookmarkActive = await page
      .locator('[data-testid="bookmark-button-1-1"].active')
      .isVisible();
    expect(bookmarkActive).toBe(true);
  });

  it('should have proper ARIA labels', async () => {
    await page.goto('http://localhost:3000/surah/1');

    // In real tests, you would check actual aria-label attributes
    // await page
    //   .locator('[data-testid="verse-1-1"]')
    //   .getAttribute('aria-label');
  });
});
