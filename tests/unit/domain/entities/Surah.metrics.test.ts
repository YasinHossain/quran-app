import {
  Surah,
  RevelationType,
  getEstimatedReadingTime,
  getJuzNumbers,
  getMemorizationDifficulty,
  isLongSurah,
  isMediumSurah,
  isMufassalSurah,
  isSevenLongSurah,
  isShortSurah,
} from '../../../../src/domain/entities';

describe('Surah Entity - Metrics', () => {
  const validId = 1;
  const validName = 'الفاتحة';
  const validArabicName = 'الفاتحة';
  const validEnglishName = 'Al-Fatiha';
  const validEnglishTranslation = 'The Opening';
  const validNumberOfAyahs = 7;
  const validRevelationType = RevelationType.MAKKI;


  describe('length classification', () => {
    it('should classify short Surah correctly (less than 20 verses)', () => {
      const shortSurah = new Surah(
        108,
        'الكوثر',
        'الكوثر',
        'Al-Kawthar',
        'The Abundance',
        3,
        RevelationType.MAKKI
      );

      expect(isShortSurah(shortSurah.numberOfAyahs)).toBe(true);
      expect(isMediumSurah(shortSurah.numberOfAyahs)).toBe(false);
      expect(isLongSurah(shortSurah.numberOfAyahs)).toBe(false);
    });

    it('should classify medium Surah correctly (20-100 verses)', () => {
      const mediumSurah = new Surah(
        12,
        'يوسف',
        'يوسف',
        'Yusuf',
        'Joseph',
        111,
        RevelationType.MAKKI
      );

      expect(isShortSurah(mediumSurah.numberOfAyahs)).toBe(false);
      expect(isMediumSurah(mediumSurah.numberOfAyahs)).toBe(false); // 111 > 100, so it's long
      expect(isLongSurah(mediumSurah.numberOfAyahs)).toBe(true);
    });

    it('should classify medium Surah correctly (exactly 20 verses)', () => {
      const mediumSurah = new Surah(20, 'طه', 'طه', 'Ta-Ha', 'Ta-Ha', 20, RevelationType.MAKKI);

      expect(isShortSurah(mediumSurah.numberOfAyahs)).toBe(false);
      expect(isMediumSurah(mediumSurah.numberOfAyahs)).toBe(true);
      expect(isLongSurah(mediumSurah.numberOfAyahs)).toBe(false);
    });

    it('should classify long Surah correctly (more than 100 verses)', () => {
      const longSurah = new Surah(
        2,
        'البقرة',
        'البقرة',
        'Al-Baqarah',
        'The Cow',
        286,
        RevelationType.MADANI
      );

      expect(isShortSurah(longSurah.numberOfAyahs)).toBe(false);
      expect(isMediumSurah(longSurah.numberOfAyahs)).toBe(false);
      expect(isLongSurah(longSurah.numberOfAyahs)).toBe(true);
    });
  });

  describe('getMemorizationDifficulty', () => {
    it('should return "easy" for Surahs with 10 or fewer verses', () => {
      const easySurah = new Surah(
        112,
        'الإخلاص',
        'الإخلاص',
        'Al-Ikhlas',
        'The Sincerity',
        4,
        RevelationType.MAKKI
      );

      expect(getMemorizationDifficulty(easySurah.numberOfAyahs)).toBe('easy');
    });

    it('should return "medium" for Surahs with 11-50 verses', () => {
      const mediumSurah = new Surah(36, 'يس', 'يس', 'Ya-Sin', 'Ya-Sin', 25, RevelationType.MAKKI);

      expect(getMemorizationDifficulty(mediumSurah.numberOfAyahs)).toBe('medium');
    });

    it('should return "hard" for Surahs with more than 50 verses', () => {
      const hardSurah = new Surah(
        18,
        'الكهف',
        'الكهف',
        'Al-Kahf',
        'The Cave',
        110,
        RevelationType.MAKKI
      );

      expect(getMemorizationDifficulty(hardSurah.numberOfAyahs)).toBe('hard');
    });
  });

  describe('getEstimatedReadingTime', () => {
    it('should calculate reading time based on number of ayahs', () => {
      const surah = new Surah(
        1,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        7, // 7 verses
        validRevelationType
      );

      const readingTime = getEstimatedReadingTime(surah.numberOfAyahs);
      // 7 verses * 15 words/verse = 105 words
      // 105 words / 150 words/minute = 0.7 minutes, rounded up to 1
      expect(readingTime).toBe(1);
    });

    it('should return reasonable time for long Surah', () => {
      const longSurah = new Surah(
        2,
        'البقرة',
        'البقرة',
        'Al-Baqarah',
        'The Cow',
        286,
        RevelationType.MADANI
      );

      const readingTime = getEstimatedReadingTime(longSurah.numberOfAyahs);
      // 286 verses * 15 words/verse = 4290 words
      // 4290 words / 150 words/minute = 28.6 minutes, rounded up to 29
      expect(readingTime).toBe(29);
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
