import { Verse } from '../../../../src/domain/entities/Verse';
import { Translation } from '../../../../src/domain/value-objects/Translation';

describe('Verse Entity', () => {
  const validId = 'verse-1-1';
  const validSurahId = 1;
  const validAyahNumber = 1;
  const validArabicText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
  const validUthmaniText = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

  describe('constructor', () => {
    it('should create a valid verse with all required parameters', () => {
      const verse = new Verse(
        validId,
        validSurahId,
        validAyahNumber,
        validArabicText,
        validUthmaniText
      );

      expect(verse.id).toBe(validId);
      expect(verse.surahId).toBe(validSurahId);
      expect(verse.ayahNumber).toBe(validAyahNumber);
      expect(verse.arabicText).toBe(validArabicText);
      expect(verse.uthmaniText).toBe(validUthmaniText);
      expect(verse.translation).toBeUndefined();
    });

    it('should create a verse with translation', () => {
      const translation = new Translation(
        1,
        1,
        'In the name of Allah, the Beneficent, the Merciful.'
      );
      const verse = new Verse(
        validId,
        validSurahId,
        validAyahNumber,
        validArabicText,
        validUthmaniText,
        translation
      );

      expect(verse.translation).toBe(translation);
    });

    it('should throw error for empty ID', () => {
      expect(
        () => new Verse('', validSurahId, validAyahNumber, validArabicText, validUthmaniText)
      ).toThrow('Verse ID cannot be empty');
    });

    it('should throw error for invalid Surah ID (below 1)', () => {
      expect(
        () => new Verse(validId, 0, validAyahNumber, validArabicText, validUthmaniText)
      ).toThrow('Invalid Surah ID');
    });

    it('should throw error for invalid Surah ID (above 114)', () => {
      expect(
        () => new Verse(validId, 115, validAyahNumber, validArabicText, validUthmaniText)
      ).toThrow('Invalid Surah ID');
    });

    it('should throw error for invalid Ayah number (below 1)', () => {
      expect(() => new Verse(validId, validSurahId, 0, validArabicText, validUthmaniText)).toThrow(
        'Invalid Ayah number'
      );
    });

    it('should throw error for empty Arabic text', () => {
      expect(() => new Verse(validId, validSurahId, validAyahNumber, '', validUthmaniText)).toThrow(
        'Arabic text cannot be empty'
      );
    });

    it('should throw error for whitespace-only Arabic text', () => {
      expect(
        () => new Verse(validId, validSurahId, validAyahNumber, '   ', validUthmaniText)
      ).toThrow('Arabic text cannot be empty');
    });

    it('should throw error for empty Uthmani text', () => {
      expect(() => new Verse(validId, validSurahId, validAyahNumber, validArabicText, '')).toThrow(
        'Uthmani text cannot be empty'
      );
    });
  });

  describe('verseKey', () => {
    it('should return correct verse key format', () => {
      const verse = new Verse(validId, 2, 255, validArabicText, validUthmaniText);

      expect(verse.verseKey).toBe('2:255');
    });
  });

  describe('isFirstVerse', () => {
    it('should return true for ayah number 1', () => {
      const verse = new Verse(validId, validSurahId, 1, validArabicText, validUthmaniText);

      expect(verse.isFirstVerse()).toBe(true);
    });

    it('should return false for ayah numbers greater than 1', () => {
      const verse = new Verse(validId, validSurahId, 2, validArabicText, validUthmaniText);

      expect(verse.isFirstVerse()).toBe(false);
    });
  });

  describe('isSajdahVerse', () => {
    it('should return true for known sajdah verses', () => {
      const sajdahVerse = new Verse('verse-7-206', 7, 206, validArabicText, validUthmaniText);

      expect(sajdahVerse.isSajdahVerse()).toBe(true);
    });

    it('should return false for non-sajdah verses', () => {
      const regularVerse = new Verse(validId, 1, 1, validArabicText, validUthmaniText);

      expect(regularVerse.isSajdahVerse()).toBe(false);
    });

    it('should return true for multiple sajdah verses', () => {
      const sajdahVerses = [
        { surah: 13, ayah: 15 },
        { surah: 16, ayah: 50 },
        { surah: 32, ayah: 15 },
        { surah: 96, ayah: 19 },
      ];

      sajdahVerses.forEach(({ surah, ayah }) => {
        const verse = new Verse(
          `verse-${surah}-${ayah}`,
          surah,
          ayah,
          validArabicText,
          validUthmaniText
        );
        expect(verse.isSajdahVerse()).toBe(true);
      });
    });
  });

  describe('getMemorizationSegments', () => {
    it('should split Arabic text into segments', () => {
      const arabicText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
      const verse = new Verse(validId, validSurahId, validAyahNumber, arabicText, validUthmaniText);

      const segments = verse.getMemorizationSegments();
      expect(segments).toHaveLength(4);
      expect(segments).toEqual(['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ']);
    });

    it('should handle text with extra whitespace', () => {
      const arabicText = '  بِسْمِ   اللَّهِ  الرَّحْمَٰنِ   الرَّحِيمِ  ';
      const verse = new Verse(validId, validSurahId, validAyahNumber, arabicText, validUthmaniText);

      const segments = verse.getMemorizationSegments();
      expect(segments).toHaveLength(4);
    });

    it('should filter out empty segments', () => {
      const arabicText = 'بِسْمِ اللَّهِ   الرَّحْمَٰنِ الرَّحِيمِ';
      const verse = new Verse(validId, validSurahId, validAyahNumber, arabicText, validUthmaniText);

      const segments = verse.getMemorizationSegments();
      expect(segments.every((segment) => segment.length > 0)).toBe(true);
    });
  });

  describe('getEstimatedReadingTime', () => {
    it('should calculate reading time based on word count', () => {
      const arabicText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'; // 4 words
      const verse = new Verse(validId, validSurahId, validAyahNumber, arabicText, validUthmaniText);

      const readingTime = verse.getEstimatedReadingTime();
      // 4 words / 150 words per minute * 60 seconds = 1.6 seconds, rounded up to 2
      expect(readingTime).toBe(2);
    });

    it('should return minimum 1 second for very short verses', () => {
      const arabicText = 'اللَّهِ'; // 1 word
      const verse = new Verse(validId, validSurahId, validAyahNumber, arabicText, validUthmaniText);

      const readingTime = verse.getEstimatedReadingTime();
      expect(readingTime).toBeGreaterThanOrEqual(1);
    });
  });

  describe('containsBismillah', () => {
    it('should return true for verses containing Bismillah', () => {
      const bismillahText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
      const verse = new Verse(
        validId,
        validSurahId,
        validAyahNumber,
        bismillahText,
        validUthmaniText
      );

      expect(verse.containsBismillah()).toBe(true);
    });

    it('should return false for verses not containing Bismillah', () => {
      const regularText = 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ';
      const verse = new Verse(validId, validSurahId, 2, regularText, validUthmaniText);

      expect(verse.containsBismillah()).toBe(false);
    });
  });

  describe('getWordCount', () => {
    it('should return correct word count', () => {
      const arabicText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'; // 4 words
      const verse = new Verse(validId, validSurahId, validAyahNumber, arabicText, validUthmaniText);

      expect(verse.getWordCount()).toBe(4);
    });
  });

  describe('equals', () => {
    it('should return true for verses with same ID', () => {
      const verse1 = new Verse(
        validId,
        validSurahId,
        validAyahNumber,
        validArabicText,
        validUthmaniText
      );
      const verse2 = new Verse(validId, 2, 2, 'different text', 'different uthmani');

      expect(verse1.equals(verse2)).toBe(true);
    });

    it('should return false for verses with different IDs', () => {
      const verse1 = new Verse(
        'verse-1-1',
        validSurahId,
        validAyahNumber,
        validArabicText,
        validUthmaniText
      );
      const verse2 = new Verse(
        'verse-1-2',
        validSurahId,
        validAyahNumber,
        validArabicText,
        validUthmaniText
      );

      expect(verse1.equals(verse2)).toBe(false);
    });
  });

  describe('withTranslation', () => {
    it('should return new verse with translation', () => {
      const originalVerse = new Verse(
        validId,
        validSurahId,
        validAyahNumber,
        validArabicText,
        validUthmaniText
      );
      const translation = new Translation(1, 1, 'Test translation');

      const verseWithTranslation = originalVerse.withTranslation(translation);

      expect(verseWithTranslation.translation).toBe(translation);
      expect(verseWithTranslation).not.toBe(originalVerse); // Should be new instance
      expect(verseWithTranslation.id).toBe(originalVerse.id);
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object with all properties', () => {
      const translation = new Translation(1, 1, 'Test translation');
      const verse = new Verse(validId, 2, 255, validArabicText, validUthmaniText, translation);

      const plainObject = verse.toPlainObject();

      expect(plainObject).toEqual({
        id: validId,
        surahId: 2,
        ayahNumber: 255,
        verseKey: '2:255',
        arabicText: validArabicText,
        uthmaniText: validUthmaniText,
        translation: translation.toPlainObject(),
        wordCount: verse.getWordCount(),
        estimatedReadingTime: verse.getEstimatedReadingTime(),
        isFirstVerse: false,
        isSajdahVerse: false, // 2:255 is not a sajdah verse
      });
    });

    it('should return plain object without translation when not provided', () => {
      const verse = new Verse(
        validId,
        validSurahId,
        validAyahNumber,
        validArabicText,
        validUthmaniText
      );

      const plainObject = verse.toPlainObject();

      expect(plainObject.translation).toBeUndefined();
      expect(typeof plainObject).toBe('object');
    });
  });
});
