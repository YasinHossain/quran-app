import {
  Surah,
  RevelationType,
  getJuzNumbers,
  isMufassalSurah,
  isSevenLongSurah,
} from '../../../../src/domain/entities';

describe('Surah Entity - Metrics', () => {
  const validId = 1;
  const validName = 'الفاتحة';
  const validArabicName = 'الفاتحة';
  const validEnglishName = 'Al-Fatiha';
  const validEnglishTranslation = 'The Opening';
  const validNumberOfAyahs = 7;
  const validRevelationType = RevelationType.MAKKI;

  describe('revelation type methods', () => {
    it('should return true for isMakki when revelation type is MAKKI', () => {
      const makkiSurah = new Surah(
        validId,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        RevelationType.MAKKI
      );

      expect(makkiSurah.isMakki()).toBe(true);
      expect(makkiSurah.isMadani()).toBe(false);
    });

    it('should return true for isMadani when revelation type is MADANI', () => {
      const madaniSurah = new Surah(
        2,
        'البقرة',
        'البقرة',
        'Al-Baqarah',
        'The Cow',
        286,
        RevelationType.MADANI
      );

      expect(madaniSurah.isMadani()).toBe(true);
      expect(madaniSurah.isMakki()).toBe(false);
    });
  });


  describe('special Surah classifications', () => {
    it('should correctly identify Seven Long Surahs', () => {
      const sevenLongSurahs = [2, 3, 4, 5, 6, 7, 9];

      sevenLongSurahs.forEach((id) => {
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

      // Test a non-seven-long surah
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

    it('should correctly identify Mufassal Surahs', () => {
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
});
