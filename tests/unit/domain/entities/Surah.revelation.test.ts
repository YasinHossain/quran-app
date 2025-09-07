import {
  validId,
  validName,
  validArabicName,
  validEnglishName,
  validEnglishTranslation,
  validNumberOfAyahs,
  validRevelationType,
  validRevelationOrder,
} from './Surah/test-utils';
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

describe('Surah Entity - Revelation', () => {
  describe('revelation type methods', () => {
    describe('isMakki', () => {
      it('returns true when revelation type is MAKKI', () => {
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
      });

      it('returns false when revelation type is MADANI', () => {
        const madaniSurah = new Surah(
          2,
          'البقرة',
          'البقرة',
          'Al-Baqarah',
          'The Cow',
          286,
          RevelationType.MADANI
        );
        expect(madaniSurah.isMakki()).toBe(false);
      });
    });

    describe('isMadani', () => {
      it('returns true when revelation type is MADANI', () => {
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
      });

      it('returns false when revelation type is MAKKI', () => {
        const makkiSurah = new Surah(
          validId,
          validName,
          validArabicName,
          validEnglishName,
          validEnglishTranslation,
          validNumberOfAyahs,
          RevelationType.MAKKI
        );
        expect(makkiSurah.isMadani()).toBe(false);
      });
    });
  });

  describe('canBeReadInPrayer', () => {
    it('should return true for most Surahs', () => {
      const regularSurah = new Surah(
        validId,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        validRevelationType
      );
      expect(regularSurah.canBeReadInPrayer()).toBe(true);
    });

    it('should return false for At-Tawbah (Surah 9)', () => {
      const atTawbah = new Surah(
        9,
        'التوبة',
        'التوبة',
        'At-Tawbah',
        'The Repentance',
        129,
        RevelationType.MADANI
      );
      expect(atTawbah.canBeReadInPrayer()).toBe(false);
    });
  });

  describe('startWithBismillah', () => {
    it('should return true for most Surahs', () => {
      const regularSurah = new Surah(
        validId,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        validRevelationType
      );
      expect(regularSurah.startWithBismillah()).toBe(true);
    });

    it('should return false for At-Tawbah (Surah 9)', () => {
      const atTawbah = new Surah(
        9,
        'التوبة',
        'التوبة',
        'At-Tawbah',
        'The Repentance',
        129,
        RevelationType.MADANI
      );
      expect(atTawbah.startWithBismillah()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for Surahs with same ID', () => {
      const surah1 = new Surah(
        validId,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        validRevelationType
      );
      const surah2 = new Surah(
        validId,
        'Different Name',
        'اسم مختلف',
        'Different English',
        'Different Translation',
        10,
        RevelationType.MADANI
      );
      expect(surah1.equals(surah2)).toBe(true);
    });

    it('should return false for Surahs with different IDs', () => {
      const surah1 = new Surah(
        validId,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        validRevelationType
      );
      const surah2 = new Surah(
        2,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        validRevelationType
      );
      expect(surah1.equals(surah2)).toBe(false);
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object with all properties and computed values', () => {
      const surah = new Surah(
        validId,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        validRevelationType,
        validRevelationOrder
      );
      const plainObject = surah.toPlainObject();
      expect(plainObject).toEqual({
        id: validId,
        name: validName,
        arabicName: validArabicName,
        englishName: validEnglishName,
        englishTranslation: validEnglishTranslation,
        numberOfAyahs: validNumberOfAyahs,
        revelationType: validRevelationType,
        revelationOrder: validRevelationOrder,
        isMakki: true,
        isMadani: false,
        canBeReadInPrayer: true,
        startWithBismillah: true,
        memorizationDifficulty: getMemorizationDifficulty(validNumberOfAyahs),
        estimatedReadingTime: getEstimatedReadingTime(validNumberOfAyahs),
        isShortSurah: isShortSurah(validNumberOfAyahs),
        isMediumSurah: isMediumSurah(validNumberOfAyahs),
        isLongSurah: isLongSurah(validNumberOfAyahs),
        isSevenLongSurah: isSevenLongSurah(validId),
        isMufassalSurah: isMufassalSurah(validId),
        juzNumbers: getJuzNumbers(validId),
      });
    });
  });
});
