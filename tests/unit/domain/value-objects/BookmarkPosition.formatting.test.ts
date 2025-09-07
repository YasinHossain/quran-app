import { validTimestamp } from './BookmarkPosition/test-utils';
import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';

describe('BookmarkPosition formatting & display', () => {
  describe('toString and verseKey', () => {
    it('returns correct verse key format', () => {
      const position = new BookmarkPosition(2, 255, validTimestamp);

      expect(position.toString()).toBe('2:255');
      expect(position.verseKey).toBe('2:255');
    });

    it('handles single digit surah and ayah', () => {
      const position = new BookmarkPosition(1, 1, validTimestamp);

      expect(position.verseKey).toBe('1:1');
    });

    it('handles three digit surah', () => {
      const position = new BookmarkPosition(114, 6, validTimestamp);

      expect(position.verseKey).toBe('114:6');
    });
  });

  describe('getDisplayText', () => {
    it('returns human-readable description', () => {
      const position = new BookmarkPosition(2, 255, validTimestamp);

      expect(position.getDisplayText()).toBe('Surah 2, Verse 255');
    });
  });

  describe('toPlainObject', () => {
    it('returns plain object with all properties', () => {
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

    it('handles first verse correctly', () => {
      const position = new BookmarkPosition(1, 1, validTimestamp);

      const plainObject = position.toPlainObject();

      expect(plainObject.isFirstVerse).toBe(true);
      expect(plainObject.verseKey).toBe('1:1');
    });
  });
});
