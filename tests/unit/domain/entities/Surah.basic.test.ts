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

describe('Surah Entity - Basic', () => {
  const validId = 1;
  const validName = 'الفاتحة';
  const validArabicName = 'الفاتحة';
  const validEnglishName = 'Al-Fatiha';
  const validEnglishTranslation = 'The Opening';
  const validNumberOfAyahs = 7;
  const validRevelationType = RevelationType.MAKKI;

  describe('constructor', () => {
    it('should create a valid Surah with all required parameters', () => {
      const surah = new Surah(
        validId,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        validRevelationType
      );

      expect(surah.id).toBe(validId);
      expect(surah.name).toBe(validName);
      expect(surah.arabicName).toBe(validArabicName);
      expect(surah.englishName).toBe(validEnglishName);
      expect(surah.englishTranslation).toBe(validEnglishTranslation);
      expect(surah.numberOfAyahs).toBe(validNumberOfAyahs);
      expect(surah.revelationType).toBe(validRevelationType);
      expect(surah.revelationOrder).toBeUndefined();
    });

    it('should create a Surah with revelation order', () => {
      const revelationOrder = 5;
      const surah = new Surah(
        validId,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        validRevelationType,
        revelationOrder
      );

      expect(surah.revelationOrder).toBe(revelationOrder);
    });

    it('should throw error for invalid Surah ID (below 1)', () => {
      expect(
        () =>
          new Surah(
            0,
            validName,
            validArabicName,
            validEnglishName,
            validEnglishTranslation,
            validNumberOfAyahs,
            validRevelationType
          )
      ).toThrow('Invalid Surah ID: must be between 1 and 114');
    });

    it('should throw error for invalid Surah ID (above 114)', () => {
      expect(
        () =>
          new Surah(
            115,
            validName,
            validArabicName,
            validEnglishName,
            validEnglishTranslation,
            validNumberOfAyahs,
            validRevelationType
          )
      ).toThrow('Invalid Surah ID: must be between 1 and 114');
    });

    it('should throw error for empty name', () => {
      expect(
        () =>
          new Surah(
            validId,
            '',
            validArabicName,
            validEnglishName,
            validEnglishTranslation,
            validNumberOfAyahs,
            validRevelationType
          )
      ).toThrow('Surah name cannot be empty');
    });

    it('should throw error for whitespace-only name', () => {
      expect(
        () =>
          new Surah(
            validId,
            '   ',
            validArabicName,
            validEnglishName,
            validEnglishTranslation,
            validNumberOfAyahs,
            validRevelationType
          )
      ).toThrow('Surah name cannot be empty');
    });

    it('should throw error for empty Arabic name', () => {
      expect(
        () =>
          new Surah(
            validId,
            validName,
            '',
            validEnglishName,
            validEnglishTranslation,
            validNumberOfAyahs,
            validRevelationType
          )
      ).toThrow('Arabic name cannot be empty');
    });

    it('should throw error for empty English name', () => {
      expect(
        () =>
          new Surah(
            validId,
            validName,
            validArabicName,
            '',
            validEnglishTranslation,
            validNumberOfAyahs,
            validRevelationType
          )
      ).toThrow('English name cannot be empty');
    });

    it('should throw error for invalid number of ayahs (below 1)', () => {
      expect(
        () =>
          new Surah(
            validId,
            validName,
            validArabicName,
            validEnglishName,
            validEnglishTranslation,
            0,
            validRevelationType
          )
      ).toThrow('Number of ayahs must be positive');
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object with all properties and computed values', () => {
      const surah = new Surah(
        1,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        validRevelationType,
        5
      );

      const plainObject = surah.toPlainObject();

      expect(plainObject).toEqual({
        id: 1,
        name: validName,
        arabicName: validArabicName,
        englishName: validEnglishName,
        englishTranslation: validEnglishTranslation,
        numberOfAyahs: validNumberOfAyahs,
        revelationType: validRevelationType,
        revelationOrder: 5,
        isMakki: true,
        isMadani: false,
        canBeReadInPrayer: true,
        startWithBismillah: true,
        memorizationDifficulty: getMemorizationDifficulty(validNumberOfAyahs),
        estimatedReadingTime: getEstimatedReadingTime(validNumberOfAyahs),
        isShortSurah: isShortSurah(validNumberOfAyahs),
        isMediumSurah: isMediumSurah(validNumberOfAyahs),
        isLongSurah: isLongSurah(validNumberOfAyahs),
        isSevenLongSurah: isSevenLongSurah(1),
        isMufassalSurah: isMufassalSurah(1),
        juzNumbers: getJuzNumbers(1),
      });
    });
  });
});
