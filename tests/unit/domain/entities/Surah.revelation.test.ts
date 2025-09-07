import { Surah, RevelationType } from '../../../../src/domain/entities';
import {
  createSurah,
  validId,
  validName,
  validArabicName,
  validEnglishName,
  validEnglishTranslation,
  validNumberOfAyahs,
} from './Surah/test-utils';

describe('Surah Entity - Revelation and Basic Methods', () => {
  describe('revelation type methods', () => {
    it('should return true for isMakki when revelation type is MAKKI', () => {
      const makkiSurah = createSurah();

      expect(makkiSurah.isMakki()).toBe(true);
      expect(makkiSurah.isMadani()).toBe(false);
    });

    it('should return true for isMadani when revelation type is MADANI', () => {
      const madaniSurah = createSurah(
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

  describe('canBeReadInPrayer', () => {
    it('should return true for most Surahs', () => {
      const regularSurah = createSurah();
      expect(regularSurah.canBeReadInPrayer()).toBe(true);
    });

    it('should return false for At-Tawbah (Surah 9)', () => {
      const atTawbah = createSurah(
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
      const regularSurah = createSurah();
      expect(regularSurah.startWithBismillah()).toBe(true);
    });

    it('should return false for At-Tawbah (Surah 9)', () => {
      const atTawbah = createSurah(
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
      const surah1 = createSurah();
      const surah2 = createSurah(1, 'Different Name', 'اسم مختلف', 'Different English', 'Different Translation', 10, RevelationType.MADANI);
      expect(surah1.equals(surah2)).toBe(true);
    });

    it('should return false for Surahs with different IDs', () => {
      const surah1 = createSurah();
      const surah2 = createSurah(2, validName, validArabicName, validEnglishName, validEnglishTranslation);
      expect(surah1.equals(surah2)).toBe(false);
    });
  });

  describe('toPlainObject', () => {
    it('should include revelation flags and basic fields', () => {
      const surah = createSurah(validId, validName, validArabicName, validEnglishName, validEnglishTranslation, validNumberOfAyahs, RevelationType.MAKKI, 5);
      const plainObject = surah.toPlainObject();

      expect(plainObject).toEqual(
        expect.objectContaining({
          id: validId,
          name: validName,
          arabicName: validArabicName,
          englishName: validEnglishName,
          englishTranslation: validEnglishTranslation,
          numberOfAyahs: validNumberOfAyahs,
          revelationType: RevelationType.MAKKI,
          revelationOrder: 5,
          isMakki: true,
          isMadani: false,
          canBeReadInPrayer: true,
          startWithBismillah: true,
        })
      );
    });
  });
});
