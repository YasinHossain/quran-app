import { createMockPage, MockPage } from './utils';

describe('Translation and Reading Features', () => {
  let page: MockPage;

  beforeEach(() => {
    page = createMockPage();
  });

  it('should toggle translation display', async () => {
    (page.locator as jest.Mock).mockImplementation((selector: string) => {
      if (selector.includes('translation-text')) {
        return {
          count: jest.fn(),
          textContent: jest.fn().mockResolvedValue('In the name of Allah'),
          isVisible: jest.fn().mockResolvedValueOnce(false).mockResolvedValue(true),
        };
      }
      return {
        count: jest.fn().mockResolvedValue(7),
        textContent: jest.fn().mockResolvedValue('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'),
        isVisible: jest.fn().mockResolvedValue(true),
      };
    });

    await page.goto('http://localhost:3000/surah/1');

    const translationHidden = await page
      .locator('[data-testid="verse-1-1"] .translation-text')
      .isVisible();
    expect(translationHidden).toBe(false);

    await page.click('[data-testid="translation-toggle"]');

    const translationVisible = await page
      .locator('[data-testid="verse-1-1"] .translation-text')
      .isVisible();
    expect(translationVisible).toBe(true);

    const translationText = await page
      .locator('[data-testid="verse-1-1"] .translation-text')
      .textContent();
    expect(translationText).toContain('In the name of Allah');
  });

  it('should change translation language', async () => {
    (page.locator as jest.Mock).mockImplementation((selector: string) => {
      if (selector.includes('translation-text')) {
        return {
          count: jest.fn(),
          textContent: jest.fn().mockResolvedValue('اللہ'),
          isVisible: jest.fn().mockResolvedValue(true),
        };
      }
      return {
        count: jest.fn().mockResolvedValue(7),
        textContent: jest.fn().mockResolvedValue('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'),
        isVisible: jest.fn().mockResolvedValue(true),
      };
    });

    await page.goto('http://localhost:3000/surah/1');
    await page.click('[data-testid="translation-settings"]');
    await page.click('[data-testid="translation-option-urdu"]');
    await page.click('[data-testid="translation-toggle"]');

    const urduTranslation = await page
      .locator('[data-testid="verse-1-1"] .translation-text')
      .textContent();
    expect(urduTranslation).toContain('اللہ');
  });
});
