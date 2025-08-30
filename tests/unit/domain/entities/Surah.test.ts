import { Surah, RevelationType } from '../../../../src/domain/entities/Surah';

describe('Surah Entity', () => {
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

      expect(shortSurah.isShortSurah()).toBe(true);
      expect(shortSurah.isMediumSurah()).toBe(false);
      expect(shortSurah.isLongSurah()).toBe(false);
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

      expect(mediumSurah.isShortSurah()).toBe(false);
      expect(mediumSurah.isMediumSurah()).toBe(false); // 111 > 100, so it's long
      expect(mediumSurah.isLongSurah()).toBe(true);
    });

    it('should classify medium Surah correctly (exactly 20 verses)', () => {
      const mediumSurah = new Surah(20, 'طه', 'طه', 'Ta-Ha', 'Ta-Ha', 20, RevelationType.MAKKI);

      expect(mediumSurah.isShortSurah()).toBe(false);
      expect(mediumSurah.isMediumSurah()).toBe(true);
      expect(mediumSurah.isLongSurah()).toBe(false);
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

      expect(longSurah.isShortSurah()).toBe(false);
      expect(longSurah.isMediumSurah()).toBe(false);
      expect(longSurah.isLongSurah()).toBe(true);
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

      expect(easySurah.getMemorizationDifficulty()).toBe('easy');
    });

    it('should return "medium" for Surahs with 11-50 verses', () => {
      const mediumSurah = new Surah(36, 'يس', 'يس', 'Ya-Sin', 'Ya-Sin', 25, RevelationType.MAKKI);

      expect(mediumSurah.getMemorizationDifficulty()).toBe('medium');
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

      expect(hardSurah.getMemorizationDifficulty()).toBe('hard');
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

      const readingTime = surah.getEstimatedReadingTime();
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

      const readingTime = longSurah.getEstimatedReadingTime();
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
        expect(surah.isSevenLongSurah()).toBe(true);
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
      expect(regularSurah.isSevenLongSurah()).toBe(false);
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
      expect(mufassalSurah.isMufassalSurah()).toBe(true);

      const nonMufassalSurah = new Surah(
        48,
        'الفتح',
        'الفتح',
        'Al-Fath',
        'The Victory',
        29,
        RevelationType.MADANI
      );
      expect(nonMufassalSurah.isMufassalSurah()).toBe(false);
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

      const juzNumbers = surah.getJuzNumbers();
      expect(Array.isArray(juzNumbers)).toBe(true);
      expect(juzNumbers.length).toBeGreaterThan(0);
      expect(juzNumbers.every((num) => num >= 1 && num <= 30)).toBe(true);
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
        memorizationDifficulty: 'easy',
        estimatedReadingTime: surah.getEstimatedReadingTime(),
        isShortSurah: true,
        isMediumSurah: false,
        isLongSurah: false,
        isSevenLongSurah: false,
        isMufassalSurah: false,
        juzNumbers: surah.getJuzNumbers(),
      });
    });
  });
});
