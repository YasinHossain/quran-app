import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';
import { validTimestamp } from './BookmarkPosition/test-utils';

describe('BookmarkPosition navigation', () => {

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
});
