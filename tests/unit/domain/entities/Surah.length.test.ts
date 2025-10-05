import { isLongSurah, isMediumSurah, isShortSurah } from '@/src/domain/entities';

import { createSurah, RevelationType } from './Surah/test-utils';

describe('Surah length classification', () => {
  it('classifies short Surah correctly (less than 20 verses)', () => {
    const surah = createSurah({ id: 108, numberOfAyahs: 3 });
    expect(isShortSurah(surah.numberOfAyahs)).toBe(true);
    expect(isMediumSurah(surah.numberOfAyahs)).toBe(false);
    expect(isLongSurah(surah.numberOfAyahs)).toBe(false);
  });

  it('classifies medium Surah within range (20-100 verses)', () => {
    const surah = createSurah({ id: 50, numberOfAyahs: 50 });
    expect(isShortSurah(surah.numberOfAyahs)).toBe(false);
    expect(isMediumSurah(surah.numberOfAyahs)).toBe(true);
    expect(isLongSurah(surah.numberOfAyahs)).toBe(false);
  });

  it('classifies medium Surah at boundary of 20 verses', () => {
    const surah = createSurah({ id: 20, numberOfAyahs: 20 });
    expect(isShortSurah(surah.numberOfAyahs)).toBe(false);
    expect(isMediumSurah(surah.numberOfAyahs)).toBe(true);
    expect(isLongSurah(surah.numberOfAyahs)).toBe(false);
  });

  it('classifies long Surah correctly (more than 100 verses)', () => {
    const surah = createSurah({ id: 2, numberOfAyahs: 286, revelationType: RevelationType.MADANI });
    expect(isShortSurah(surah.numberOfAyahs)).toBe(false);
    expect(isMediumSurah(surah.numberOfAyahs)).toBe(false);
    expect(isLongSurah(surah.numberOfAyahs)).toBe(true);
  });
});
