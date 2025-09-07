import { isLongSurah, isMediumSurah, isShortSurah } from '../../../../src/domain/entities';
import { createSurah } from './Surah/test-utils';

describe('Surah length classification', () => {
  it('classifies short Surah correctly', () => {
    const surah = createSurah(19);
    expect(isShortSurah(surah.numberOfAyahs)).toBe(true);
    expect(isMediumSurah(surah.numberOfAyahs)).toBe(false);
    expect(isLongSurah(surah.numberOfAyahs)).toBe(false);
  });

  it('classifies medium Surah correctly', () => {
    const surah = createSurah(20);
    expect(isShortSurah(surah.numberOfAyahs)).toBe(false);
    expect(isMediumSurah(surah.numberOfAyahs)).toBe(true);
    expect(isLongSurah(surah.numberOfAyahs)).toBe(false);
  });

  it('classifies long Surah correctly', () => {
    const surah = createSurah(101);
    expect(isShortSurah(surah.numberOfAyahs)).toBe(false);
    expect(isMediumSurah(surah.numberOfAyahs)).toBe(false);
    expect(isLongSurah(surah.numberOfAyahs)).toBe(true);
  });
});
