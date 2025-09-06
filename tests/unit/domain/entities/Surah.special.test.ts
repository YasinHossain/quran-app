import { Surah, RevelationType } from '../../../../src/domain/entities';

describe('Surah Entity - Special Cases', () => {
  const validId = 1;
  const validName = 'الفاتحة';
  const validArabicName = 'الفاتحة';
  const validEnglishName = 'Al-Fatiha';
  const validEnglishTranslation = 'The Opening';
  const validNumberOfAyahs = 7;
  const validRevelationType = RevelationType.MAKKI;

  describe('canBeReadInPrayer', () => {
    it('should return true for most Surahs', () => {
      const regularSurah = new Surah(
        1,
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
        1,
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
        1,
        validName,
        validArabicName,
        validEnglishName,
        validEnglishTranslation,
        validNumberOfAyahs,
        validRevelationType
      );
      const surah2 = new Surah(
        1,
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
        1,
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
});
