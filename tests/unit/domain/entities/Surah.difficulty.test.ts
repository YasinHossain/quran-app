import {
  getEstimatedReadingTime,
  getMemorizationDifficulty,
  getWordCount,
} from '@/src/domain/entities';

import { createSurah } from './Surah/test-utils';

const validArabicText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';

describe('Surah difficulty utilities', () => {
  describe('getMemorizationDifficulty', () => {
    it('returns "easy" for 10 or fewer verses', () => {
      const surah = createSurah({ numberOfAyahs: 4 });
      expect(getMemorizationDifficulty(surah.numberOfAyahs)).toBe('easy');
    });

    it('returns "medium" for 11-50 verses', () => {
      const surah = createSurah({ id: 36, numberOfAyahs: 25 });
      expect(getMemorizationDifficulty(surah.numberOfAyahs)).toBe('medium');
    });

    it('returns "hard" for more than 50 verses', () => {
      const surah = createSurah({ id: 18, numberOfAyahs: 110 });
      expect(getMemorizationDifficulty(surah.numberOfAyahs)).toBe('hard');
    });
  });

  describe('getEstimatedReadingTime', () => {
    it('calculates reading time based on Arabic text', () => {
      const readingTime = getEstimatedReadingTime('اللَّهِ');
      expect(readingTime).toBe(1);
    });

    it('returns reasonable time for long Surah', () => {
      const longText = 'كلمة '.repeat(72).trim();
      const readingTime = getEstimatedReadingTime(longText);
      expect(readingTime).toBe(29);
    });
  });

  describe('getWordCount', () => {
    it('counts words in Arabic text', () => {
      expect(getWordCount(validArabicText)).toBe(4);
    });
  });
});
