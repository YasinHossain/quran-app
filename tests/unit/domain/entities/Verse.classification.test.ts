import { validArabicText } from './Verse/test-utils';
import {
  isSajdahVerse,
  getMemorizationSegments,
  getEstimatedReadingTime,
  containsBismillah,
  getWordCount,
} from '../../../../src/domain/entities';

describe('Verse classification utilities', () => {
  describe('isSajdahVerse', () => {
    it('returns true for known sajdah verses', () => {
      expect(isSajdahVerse(7, 206)).toBe(true);
    });

    it('returns false for non-sajdah verses', () => {
      expect(isSajdahVerse(1, 1)).toBe(false);
    });

    it('returns true for multiple sajdah verses', () => {
      const sajdahVerses = [
        { surah: 13, ayah: 15 },
        { surah: 16, ayah: 50 },
        { surah: 32, ayah: 15 },
        { surah: 96, ayah: 19 },
      ];

      sajdahVerses.forEach(({ surah, ayah }) => {
        expect(isSajdahVerse(surah, ayah)).toBe(true);
      });
    });
  });

  describe('getMemorizationSegments', () => {
    it('splits Arabic text into segments', () => {
      const segments = getMemorizationSegments(validArabicText);
      expect(segments).toHaveLength(4);
      expect(segments).toEqual(['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ']);
    });

    it('handles text with extra whitespace', () => {
      const segments = getMemorizationSegments('  ' + validArabicText + '  ');
      expect(segments).toHaveLength(4);
    });

    it('filters out empty segments', () => {
      const segments = getMemorizationSegments('بِسْمِ اللَّهِ   الرَّحْمَٰنِ الرَّحِيمِ');
      expect(segments.every((segment) => segment.length > 0)).toBe(true);
    });
  });

  describe('getEstimatedReadingTime', () => {
    it('calculates reading time based on word count', () => {
      const readingTime = getEstimatedReadingTime(validArabicText);
      expect(readingTime).toBe(2);
    });

    it('returns minimum 1 second for very short verses', () => {
      const readingTime = getEstimatedReadingTime('اللَّهِ');
      expect(readingTime).toBeGreaterThanOrEqual(1);
    });
  });

  describe('containsBismillah', () => {
    it('returns true for verses containing Bismillah', () => {
      expect(containsBismillah(validArabicText)).toBe(true);
    });

    it('returns false for verses without Bismillah', () => {
      const regularText = 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ';
      expect(containsBismillah(regularText)).toBe(false);
    });
  });

  describe('getWordCount', () => {
    it('returns correct word count', () => {
      expect(getWordCount(validArabicText)).toBe(4);
    });
  });
});
