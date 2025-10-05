import { createMockPage, MockPage } from './utils';

describe('Navigation and Verse Display', () => {
  let page: MockPage;

  beforeEach(() => {
    page = createMockPage();
  });

  it('should navigate to surah and display verses', async () => {
    await page.goto('http://localhost:3000');
    await page.click('[data-testid="surah-1"]');
    await page.waitForURL('**/surah/1');

    const verseCount = await page.locator('[data-testid="verse-card"]').count();
    expect(verseCount).toBe(7);

    const firstVerseText = await page
      .locator('[data-testid="verse-1-1"] .arabic-text')
      .textContent();
    expect(firstVerseText).toContain('بِسْمِ اللَّهِ');

    const verseNumber = await page.locator('[data-testid="verse-number-1-1"]').textContent();
    expect(verseNumber).toBe('1');
  });

  it('should display surah information correctly', async () => {
    await page.goto('http://localhost:3000/surah/1');

    const surahName = await page.locator('[data-testid="surah-name"]').textContent();
    expect(surahName).toContain('Al-Fatiha');

    const surahNameArabic = await page.locator('[data-testid="surah-name-arabic"]').textContent();
    expect(surahNameArabic).toContain('الفاتحة');

    const verseCount = await page.locator('[data-testid="verse-count"]').textContent();
    expect(verseCount).toContain('7');

    const revelationType = await page.locator('[data-testid="revelation-type"]').textContent();
    expect(revelationType).toContain('Makki');
  });

  it('should navigate between consecutive surahs', async () => {
    await page.goto('http://localhost:3000/surah/1');

    await page.click('[data-testid="next-surah-button"]');
    await page.waitForURL('**/surah/2');

    const surahName = await page.locator('[data-testid="surah-name"]').textContent();
    expect(surahName).toContain('Al-Baqarah');

    await page.click('[data-testid="previous-surah-button"]');
    await page.waitForURL('**/surah/1');

    const backToFirstSurah = await page.locator('[data-testid="surah-name"]').textContent();
    expect(backToFirstSurah).toContain('Al-Fatiha');
  });
});
