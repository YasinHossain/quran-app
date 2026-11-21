import wordCounts from '@/data/verse-word-counts.json';
import { SURAH_VERSE_COUNTS } from '@/lib/seo/surahSlugs';

describe('verse-word-counts.json', () => {
  it('has one count per verse for every surah', () => {
    expect(wordCounts).toHaveLength(114);
    wordCounts.forEach((verses, index) => {
      expect(verses).toHaveLength(SURAH_VERSE_COUNTS[index]!);
      expect(verses.every((count) => Number.isInteger(count) && count > 0)).toBe(true);
    });
  });

  it('matches the Quran.com word-by-word totals', () => {
    expect(wordCounts.flat().reduce((sum, count) => sum + count, 0)).toBe(77430);
    expect(wordCounts[0]).toEqual([4, 4, 2, 3, 4, 3, 9]);
    // Ayat al-Dayn (2:282) is the longest verse.
    expect(Math.max(...wordCounts.flat())).toBe(128);
    expect(wordCounts[1]![281]).toBe(128);
  });
});
