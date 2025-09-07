import {
  getEstimatedReadingTime,
  getMemorizationDifficulty,
} from '../../../../src/domain/entities';
import { createSurah } from './Surah/test-utils';

describe('Surah helpers - difficulty and reading time', () => {
  describe('getMemorizationDifficulty', () => {
    it('returns easy for Surahs with 10 or fewer verses', () => {
      const surah = createSurah(10);
      expect(getMemorizationDifficulty(surah.numberOfAyahs)).toBe('easy');
    });

    it('returns medium for Surahs with 11-50 verses', () => {
      const surah = createSurah(50);
      expect(getMemorizationDifficulty(surah.numberOfAyahs)).toBe('medium');
    });

    it('returns hard for Surahs with more than 50 verses', () => {
      const surah = createSurah(51);
      expect(getMemorizationDifficulty(surah.numberOfAyahs)).toBe('hard');
    });
  });

  describe('getEstimatedReadingTime', () => {
    it('calculates reading time based on verse count', () => {
      const surah = createSurah(7);
      const readingTime = getEstimatedReadingTime(surah.numberOfAyahs);
      expect(readingTime).toBe(1);
    });

    it('calculates reading time for long surahs', () => {
      const surah = createSurah(286);
      const readingTime = getEstimatedReadingTime(surah.numberOfAyahs);
      expect(readingTime).toBe(29);
    });
  });
});
