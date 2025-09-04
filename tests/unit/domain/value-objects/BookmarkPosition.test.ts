import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';

describe('BookmarkPosition Value Object', () => {
  const validSurahId = 1;
  const validAyahNumber = 1;
  const validTimestamp = new Date('2024-01-01T10:00:00Z');

  describe('constructor', () => {
    it('should create a valid BookmarkPosition with all parameters', () => {
      const position = new BookmarkPosition(validSurahId, validAyahNumber, validTimestamp);

      expect(position.surahId).toBe(validSurahId);
      expect(position.ayahNumber).toBe(validAyahNumber);
      expect(position.timestamp).toBe(validTimestamp);
    });

    it('should throw error for invalid Surah ID (below 1)', () => {
      expect(() => new BookmarkPosition(0, validAyahNumber, validTimestamp)).toThrow(
        'Invalid Surah ID: must be between 1 and 114'
      );
    });

    it('should throw error for invalid Surah ID (above 114)', () => {
      expect(() => new BookmarkPosition(115, validAyahNumber, validTimestamp)).toThrow(
        'Invalid Surah ID: must be between 1 and 114'
      );
    });

    it('should throw error for invalid Ayah number (below 1)', () => {
      expect(() => new BookmarkPosition(validSurahId, 0, validTimestamp)).toThrow(
        'Ayah number must be positive'
      );
    });

    it('should throw error for null timestamp', () => {
      expect(() =>
        new BookmarkPosition(validSurahId, validAyahNumber, null as unknown as Date)
      ).toThrow('Timestamp is required');
    });

    it('should throw error for undefined timestamp', () => {
      expect(() =>
        new BookmarkPosition(validSurahId, validAyahNumber, undefined as unknown as Date)
      ).toThrow('Timestamp is required');
    });
  });

  describe('toString and verseKey', () => {
    it('should return correct verse key format', () => {
      const position = new BookmarkPosition(2, 255, validTimestamp);

      expect(position.toString()).toBe('2:255');
      expect(position.verseKey).toBe('2:255');
    });

    it('should handle single digit surah and ayah', () => {
      const position = new BookmarkPosition(1, 1, validTimestamp);

      expect(position.verseKey).toBe('1:1');
    });

    it('should handle three digit surah (maximum 114)', () => {
      const position = new BookmarkPosition(114, 6, validTimestamp);

      expect(position.verseKey).toBe('114:6');
    });
  });

  describe('isFirstVerse', () => {
    it('should return true for ayah number 1', () => {
      const position = new BookmarkPosition(5, 1, validTimestamp);

      expect(position.isFirstVerse()).toBe(true);
    });

    it('should return false for ayah numbers greater than 1', () => {
      const position = new BookmarkPosition(5, 2, validTimestamp);

      expect(position.isFirstVerse()).toBe(false);
    });
  });

  describe('isInSurah', () => {
    it('should return true for matching Surah ID', () => {
      const position = new BookmarkPosition(5, 10, validTimestamp);

      expect(position.isInSurah(5)).toBe(true);
    });

    it('should return false for non-matching Surah ID', () => {
      const position = new BookmarkPosition(5, 10, validTimestamp);

      expect(position.isInSurah(6)).toBe(false);
    });
  });

  describe('getNextVerse', () => {
    it('should return next verse in same Surah', () => {
      const position = new BookmarkPosition(1, 5, validTimestamp);
      const nextPosition = position.getNextVerse(7); // Al-Fatiha has 7 verses

      expect(nextPosition).toBeDefined();
      expect(nextPosition!.surahId).toBe(1);
      expect(nextPosition!.ayahNumber).toBe(6);
    });

    it('should return null for last verse of Surah', () => {
      const position = new BookmarkPosition(1, 7, validTimestamp);
      const nextPosition = position.getNextVerse(7); // Last verse of Al-Fatiha

      expect(nextPosition).toBeNull();
    });

    it('should return null when current ayah equals max ayah', () => {
      const position = new BookmarkPosition(2, 286, validTimestamp);
      const nextPosition = position.getNextVerse(286); // Last verse of Al-Baqarah

      expect(nextPosition).toBeNull();
    });
  });

  describe('getPreviousVerse', () => {
    it('should return previous verse in same Surah', () => {
      const position = new BookmarkPosition(1, 5, validTimestamp);
      const previousPosition = position.getPreviousVerse();

      expect(previousPosition).toBeDefined();
      expect(previousPosition!.surahId).toBe(1);
      expect(previousPosition!.ayahNumber).toBe(4);
    });

    it('should return null for first verse of Surah', () => {
      const position = new BookmarkPosition(1, 1, validTimestamp);
      const previousPosition = position.getPreviousVerse();

      expect(previousPosition).toBeNull();
    });
  });

  describe('compareTo', () => {
    it('should return negative when this position comes before other', () => {
      const position1 = new BookmarkPosition(1, 5, validTimestamp);
      const position2 = new BookmarkPosition(1, 6, validTimestamp);

      expect(position1.compareTo(position2)).toBeLessThan(0);
    });

    it('should return positive when this position comes after other', () => {
      const position1 = new BookmarkPosition(1, 6, validTimestamp);
      const position2 = new BookmarkPosition(1, 5, validTimestamp);

      expect(position1.compareTo(position2)).toBeGreaterThan(0);
    });

    it('should return zero when positions are equal', () => {
      const position1 = new BookmarkPosition(1, 5, validTimestamp);
      const position2 = new BookmarkPosition(1, 5, new Date());

      expect(position1.compareTo(position2)).toBe(0);
    });

    it('should prioritize Surah comparison over Ayah', () => {
      const position1 = new BookmarkPosition(1, 100, validTimestamp);
      const position2 = new BookmarkPosition(2, 1, validTimestamp);

      expect(position1.compareTo(position2)).toBeLessThan(0);
    });

    it('should handle different surahs correctly', () => {
      const position1 = new BookmarkPosition(2, 1, validTimestamp);
      const position2 = new BookmarkPosition(1, 7, validTimestamp);

      expect(position1.compareTo(position2)).toBeGreaterThan(0);
    });
  });

  describe('isBefore and isAfter', () => {
    it('should correctly identify when position is before another', () => {
      const position1 = new BookmarkPosition(1, 5, validTimestamp);
      const position2 = new BookmarkPosition(1, 6, validTimestamp);

      expect(position1.isBefore(position2)).toBe(true);
      expect(position2.isBefore(position1)).toBe(false);
    });

    it('should correctly identify when position is after another', () => {
      const position1 = new BookmarkPosition(1, 6, validTimestamp);
      const position2 = new BookmarkPosition(1, 5, validTimestamp);

      expect(position1.isAfter(position2)).toBe(true);
      expect(position2.isAfter(position1)).toBe(false);
    });

    it('should handle cross-surah comparisons', () => {
      const position1 = new BookmarkPosition(1, 7, validTimestamp);
      const position2 = new BookmarkPosition(2, 1, validTimestamp);

      expect(position1.isBefore(position2)).toBe(true);
      expect(position2.isAfter(position1)).toBe(true);
    });
  });

  describe('isInSameSurah', () => {
    it('should return true for positions in same Surah', () => {
      const position1 = new BookmarkPosition(1, 1, validTimestamp);
      const position2 = new BookmarkPosition(1, 7, validTimestamp);

      expect(position1.isInSameSurah(position2)).toBe(true);
    });

    it('should return false for positions in different Surahs', () => {
      const position1 = new BookmarkPosition(1, 7, validTimestamp);
      const position2 = new BookmarkPosition(2, 1, validTimestamp);

      expect(position1.isInSameSurah(position2)).toBe(false);
    });
  });

  describe('getDistanceFrom', () => {
    it('should return correct distance for positions in same Surah', () => {
      const position1 = new BookmarkPosition(1, 1, validTimestamp);
      const position2 = new BookmarkPosition(1, 5, validTimestamp);

      expect(position1.getDistanceFrom(position2)).toBe(4);
      expect(position2.getDistanceFrom(position1)).toBe(4);
    });

    it('should return null for positions in different Surahs', () => {
      const position1 = new BookmarkPosition(1, 1, validTimestamp);
      const position2 = new BookmarkPosition(2, 1, validTimestamp);

      expect(position1.getDistanceFrom(position2)).toBeNull();
    });

    it('should return 0 for same positions', () => {
      const position1 = new BookmarkPosition(1, 5, validTimestamp);
      const position2 = new BookmarkPosition(1, 5, new Date());

      expect(position1.getDistanceFrom(position2)).toBe(0);
    });
  });

  describe('isWithinRange', () => {
    it('should return true when positions are within range in same Surah', () => {
      const position1 = new BookmarkPosition(1, 1, validTimestamp);
      const position2 = new BookmarkPosition(1, 3, validTimestamp);

      expect(position1.isWithinRange(position2, 5)).toBe(true);
      expect(position1.isWithinRange(position2, 2)).toBe(true);
    });

    it('should return false when positions are outside range in same Surah', () => {
      const position1 = new BookmarkPosition(1, 1, validTimestamp);
      const position2 = new BookmarkPosition(1, 6, validTimestamp);

      expect(position1.isWithinRange(position2, 3)).toBe(false);
    });

    it('should return false for positions in different Surahs', () => {
      const position1 = new BookmarkPosition(1, 1, validTimestamp);
      const position2 = new BookmarkPosition(2, 1, validTimestamp);

      expect(position1.isWithinRange(position2, 100)).toBe(false);
    });
  });

  describe('getDisplayText', () => {
    it('should return human-readable description', () => {
      const position = new BookmarkPosition(2, 255, validTimestamp);

      expect(position.getDisplayText()).toBe('Surah 2, Verse 255');
    });
  });

  describe('equals', () => {
    it('should return true for positions with same Surah and Ayah', () => {
      const position1 = new BookmarkPosition(1, 5, validTimestamp);
      const position2 = new BookmarkPosition(1, 5, new Date());

      expect(position1.equals(position2)).toBe(true);
    });

    it('should return false for positions with different Surah', () => {
      const position1 = new BookmarkPosition(1, 5, validTimestamp);
      const position2 = new BookmarkPosition(2, 5, validTimestamp);

      expect(position1.equals(position2)).toBe(false);
    });

    it('should return false for positions with different Ayah', () => {
      const position1 = new BookmarkPosition(1, 5, validTimestamp);
      const position2 = new BookmarkPosition(1, 6, validTimestamp);

      expect(position1.equals(position2)).toBe(false);
    });
  });

  describe('withNewTimestamp', () => {
    it('should create new position with updated timestamp', () => {
      const originalPosition = new BookmarkPosition(1, 5, validTimestamp);
      const newPosition = originalPosition.withNewTimestamp();

      expect(newPosition.surahId).toBe(originalPosition.surahId);
      expect(newPosition.ayahNumber).toBe(originalPosition.ayahNumber);
      expect(newPosition.timestamp).not.toBe(originalPosition.timestamp);
      expect(newPosition).not.toBe(originalPosition); // Should be new instance
    });
  });

  describe('toPlainObject', () => {
    it('should return plain object with all properties', () => {
      const position = new BookmarkPosition(2, 255, validTimestamp);

      const plainObject = position.toPlainObject();

      expect(plainObject).toEqual({
        surahId: 2,
        ayahNumber: 255,
        verseKey: '2:255',
        timestamp: validTimestamp.toISOString(),
        isFirstVerse: false,
        displayText: 'Surah 2, Verse 255',
      });
    });

    it('should handle first verse correctly', () => {
      const position = new BookmarkPosition(1, 1, validTimestamp);

      const plainObject = position.toPlainObject();

      expect(plainObject.isFirstVerse).toBe(true);
      expect(plainObject.verseKey).toBe('1:1');
    });
  });

  describe('fromVerseKey static method', () => {
    it('should create BookmarkPosition from valid verse key', () => {
      const position = BookmarkPosition.fromVerseKey('2:255');

      expect(position.surahId).toBe(2);
      expect(position.ayahNumber).toBe(255);
      expect(position.verseKey).toBe('2:255');
    });

    it('should handle single digit values', () => {
      const position = BookmarkPosition.fromVerseKey('1:1');

      expect(position.surahId).toBe(1);
      expect(position.ayahNumber).toBe(1);
    });

    it('should handle three digit surah', () => {
      const position = BookmarkPosition.fromVerseKey('114:6');

      expect(position.surahId).toBe(114);
      expect(position.ayahNumber).toBe(6);
    });

    it('should throw error for invalid format (no colon)', () => {
      expect(() => BookmarkPosition.fromVerseKey('2255')).toThrow(
        'Invalid verse key format. Expected "surah:ayah"'
      );
    });

    it('should throw error for invalid format (too many parts)', () => {
      expect(() => BookmarkPosition.fromVerseKey('2:255:extra')).toThrow(
        'Invalid verse key format. Expected "surah:ayah"'
      );
    });

    it('should throw error for non-numeric surah', () => {
      expect(() => BookmarkPosition.fromVerseKey('abc:255')).toThrow(
        'Invalid verse key: surah and ayah must be numbers'
      );
    });

    it('should throw error for non-numeric ayah', () => {
      expect(() => BookmarkPosition.fromVerseKey('2:abc')).toThrow(
        'Invalid verse key: surah and ayah must be numbers'
      );
    });

    it('should throw error for empty parts', () => {
      expect(() => BookmarkPosition.fromVerseKey(':255')).toThrow(
        'Invalid verse key: surah and ayah must be numbers'
      );
    });
  });
});
