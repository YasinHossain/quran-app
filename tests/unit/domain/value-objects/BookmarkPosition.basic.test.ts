import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';

describe('BookmarkPosition Value Object - basic', () => {
  const validSurahId = 1;
  const validAyahNumber = 1;
  const validTimestamp = new Date('2024-01-01T10:00:00Z');

  // Helper function to reduce nesting levels
  const expectBookmarkPositionToThrow = (
    surahId: number,
    ayahNumber: number,
    timestamp: Date | null | undefined,
    expectedMessage: string
  ) => {
    const createPosition = () => new BookmarkPosition(surahId, ayahNumber, timestamp as Date);
    expect(createPosition).toThrow(expectedMessage);
  };

  describe('constructor', () => {
    it('should create a valid BookmarkPosition with all parameters', () => {
      const position = new BookmarkPosition(validSurahId, validAyahNumber, validTimestamp);

      expect(position.surahId).toBe(validSurahId);
      expect(position.ayahNumber).toBe(validAyahNumber);
      expect(position.timestamp).toBe(validTimestamp);
    });

    it('should throw error for invalid Surah ID (below 1)', () => {
      expectBookmarkPositionToThrow(
        0,
        validAyahNumber,
        validTimestamp,
        'Invalid Surah ID: must be between 1 and 114'
      );
    });

    it('should throw error for invalid Surah ID (above 114)', () => {
      expectBookmarkPositionToThrow(
        115,
        validAyahNumber,
        validTimestamp,
        'Invalid Surah ID: must be between 1 and 114'
      );
    });

    it('should throw error for invalid Ayah number (below 1)', () => {
      expectBookmarkPositionToThrow(
        validSurahId,
        0,
        validTimestamp,
        'Ayah number must be positive'
      );
    });

    it('should throw error for null timestamp', () => {
      expectBookmarkPositionToThrow(validSurahId, validAyahNumber, null, 'Timestamp is required');
    });

    it('should throw error for undefined timestamp', () => {
      expectBookmarkPositionToThrow(
        validSurahId,
        validAyahNumber,
        undefined,
        'Timestamp is required'
      );
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

  describe('getDisplayText', () => {
    it('should return human-readable description', () => {
      const position = new BookmarkPosition(2, 255, validTimestamp);

      expect(position.getDisplayText()).toBe('Surah 2, Verse 255');
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
