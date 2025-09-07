import { validTimestamp } from './BookmarkPosition/test-utils';
import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';

describe('BookmarkPosition classification helpers', () => {
  describe('isFirstVerse', () => {
    it('returns true for ayah number 1', () => {
      const position = new BookmarkPosition(5, 1, validTimestamp);

      expect(position.isFirstVerse()).toBe(true);
    });

    it('returns false for ayah numbers greater than 1', () => {
      const position = new BookmarkPosition(5, 2, validTimestamp);

      expect(position.isFirstVerse()).toBe(false);
    });
  });

  describe('isInSurah', () => {
    it('returns true for matching Surah ID', () => {
      const position = new BookmarkPosition(5, 10, validTimestamp);

      expect(position.isInSurah(5)).toBe(true);
    });

    it('returns false for non-matching Surah ID', () => {
      const position = new BookmarkPosition(5, 10, validTimestamp);

      expect(position.isInSurah(6)).toBe(false);
    });
  });
});
