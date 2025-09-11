import {
  Surah,
  RevelationType,
  getJuzNumbers,
  isMufassalSurah,
  isSevenLongSurah,
} from '@/src/domain/entities';

import {
  validName,
  validArabicName,
  validEnglishName,
  validEnglishTranslation,
  validNumberOfAyahs,
  validRevelationType,
} from './Surah/test-utils';

describe('Seven Long Surahs', () => {
  it.each([2, 3, 4, 5, 6, 7, 9])('returns true for %s', (id) => {
    const surah = new Surah(
      id,
      `Surah ${id}`,
      `السورة ${id}`,
      `Surah ${id}`,
      `The ${id}`,
      100,
      RevelationType.MAKKI
    );
    expect(isSevenLongSurah(surah.id)).toBe(true);
  });

  it('returns false for non Seven Long Surahs', () => {
    const regularSurah = new Surah(
      8,
      'الأنفال',
      'الأنفال',
      'Al-Anfal',
      'The Spoils of War',
      75,
      RevelationType.MADANI
    );
    expect(isSevenLongSurah(regularSurah.id)).toBe(false);
  });
});

describe('Mufassal Surahs', () => {
  it('returns true for Mufassal Surahs', () => {
    const mufassalSurah = new Surah(
      49,
      'الحجرات',
      'الحجرات',
      'Al-Hujurat',
      'The Rooms',
      18,
      RevelationType.MADANI
    );
    expect(isMufassalSurah(mufassalSurah.id)).toBe(true);
  });

  it('returns false for non Mufassal Surahs', () => {
    const nonMufassalSurah = new Surah(
      48,
      'الفتح',
      'الفتح',
      'Al-Fath',
      'The Victory',
      29,
      RevelationType.MADANI
    );
    expect(isMufassalSurah(nonMufassalSurah.id)).toBe(false);
  });
});

describe('getJuzNumbers', () => {
  it('should return array of Juz numbers', () => {
    const surah = new Surah(
      1,
      validName,
      validArabicName,
      validEnglishName,
      validEnglishTranslation,
      validNumberOfAyahs,
      validRevelationType
    );
    const juzNumbers = getJuzNumbers(surah.id);
    expect(Array.isArray(juzNumbers)).toBe(true);
    expect(juzNumbers.length).toBeGreaterThan(0);
    expect(juzNumbers.every((num) => num >= 1 && num <= 30)).toBe(true);
  });
});
