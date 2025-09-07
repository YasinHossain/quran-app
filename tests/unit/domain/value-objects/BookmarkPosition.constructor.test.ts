import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';
import { validSurahId, validAyahNumber, validTimestamp } from './BookmarkPosition/test-utils';

describe('BookmarkPosition constructor & validation', () => {
  const expectBookmarkPositionToThrow = (
    surahId: number,
    ayahNumber: number,
    timestamp: Date | null | undefined,
    expectedMessage: string
  ) => {
    const createPosition = () => new BookmarkPosition(surahId, ayahNumber, timestamp as Date);
    expect(createPosition).toThrow(expectedMessage);
  };

  it('creates a valid BookmarkPosition with all parameters', () => {
    const position = new BookmarkPosition(validSurahId, validAyahNumber, validTimestamp);

    expect(position.surahId).toBe(validSurahId);
    expect(position.ayahNumber).toBe(validAyahNumber);
    expect(position.timestamp).toBe(validTimestamp);
  });

  it('throws error for invalid Surah ID below 1', () => {
    expectBookmarkPositionToThrow(0, validAyahNumber, validTimestamp, 'Invalid Surah ID: must be between 1 and 114');
  });

  it('throws error for invalid Surah ID above 114', () => {
    expectBookmarkPositionToThrow(115, validAyahNumber, validTimestamp, 'Invalid Surah ID: must be between 1 and 114');
  });

  it('throws error for invalid Ayah number below 1', () => {
    expectBookmarkPositionToThrow(validSurahId, 0, validTimestamp, 'Ayah number must be positive');
  });

  it('throws error for null timestamp', () => {
    expectBookmarkPositionToThrow(validSurahId, validAyahNumber, null, 'Timestamp is required');
  });

  it('throws error for undefined timestamp', () => {
    expectBookmarkPositionToThrow(validSurahId, validAyahNumber, undefined, 'Timestamp is required');
  });

  describe('withNewTimestamp', () => {
    it('creates new position with updated timestamp', () => {
      const originalPosition = new BookmarkPosition(validSurahId, validAyahNumber, validTimestamp);
      const newPosition = originalPosition.withNewTimestamp();

      expect(newPosition.surahId).toBe(originalPosition.surahId);
      expect(newPosition.ayahNumber).toBe(originalPosition.ayahNumber);
      expect(newPosition.timestamp).not.toBe(originalPosition.timestamp);
      expect(newPosition).not.toBe(originalPosition);
    });
  });

  describe('fromVerseKey', () => {
    it('creates BookmarkPosition from valid verse key', () => {
      const position = BookmarkPosition.fromVerseKey('2:255');

      expect(position.surahId).toBe(2);
      expect(position.ayahNumber).toBe(255);
      expect(position.verseKey).toBe('2:255');
    });

    it('handles single digit values', () => {
      const position = BookmarkPosition.fromVerseKey('1:1');

      expect(position.surahId).toBe(1);
      expect(position.ayahNumber).toBe(1);
    });

    it('handles three digit surah', () => {
      const position = BookmarkPosition.fromVerseKey('114:6');

      expect(position.surahId).toBe(114);
      expect(position.ayahNumber).toBe(6);
    });

    it('throws error for invalid format without colon', () => {
      expect(() => BookmarkPosition.fromVerseKey('2255')).toThrow('Invalid verse key format. Expected "surah:ayah"');
    });

    it('throws error for invalid format with too many parts', () => {
      expect(() => BookmarkPosition.fromVerseKey('2:255:extra')).toThrow('Invalid verse key format. Expected "surah:ayah"');
    });

    it('throws error for non-numeric surah', () => {
      expect(() => BookmarkPosition.fromVerseKey('abc:255')).toThrow('Invalid verse key: surah and ayah must be numbers');
    });

    it('throws error for non-numeric ayah', () => {
      expect(() => BookmarkPosition.fromVerseKey('2:abc')).toThrow('Invalid verse key: surah and ayah must be numbers');
    });

    it('throws error for empty parts', () => {
      expect(() => BookmarkPosition.fromVerseKey(':255')).toThrow('Invalid verse key: surah and ayah must be numbers');
    });
  });
});
