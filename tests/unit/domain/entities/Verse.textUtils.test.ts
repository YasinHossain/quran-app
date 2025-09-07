import { validArabicText } from './Verse/test-utils';
import {
  getMemorizationSegments,
  getEstimatedReadingTime,
  containsBismillah,
  getWordCount,
} from '../../../../src/domain/entities';

describe('Verse text utilities', () => {
  it('getMemorizationSegments splits Arabic text into segments', () => {
    const segments = getMemorizationSegments(validArabicText);
    expect(segments).toHaveLength(4);
    expect(segments).toEqual(['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ']);
  });

  it('handles text with extra whitespace and filters empties', () => {
    const segments1 = getMemorizationSegments('  ' + validArabicText + '  ');
    expect(segments1).toHaveLength(4);
    const segments2 = getMemorizationSegments('بِسْمِ اللَّهِ   الرَّحْمَٰنِ الرَّحِيمِ');
    expect(segments2.every((segment) => segment.length > 0)).toBe(true);
  });

  it('getEstimatedReadingTime computes reasonable times', () => {
    const readingTime = getEstimatedReadingTime(validArabicText);
    expect(readingTime).toBe(2);
    const shortTime = getEstimatedReadingTime('اللَّهِ');
    expect(shortTime).toBeGreaterThanOrEqual(1);
  });

  it('containsBismillah and getWordCount', () => {
    expect(containsBismillah(validArabicText)).toBe(true);
    const regularText = 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ';
    expect(containsBismillah(regularText)).toBe(false);
    expect(getWordCount(validArabicText)).toBe(4);
  });
});
