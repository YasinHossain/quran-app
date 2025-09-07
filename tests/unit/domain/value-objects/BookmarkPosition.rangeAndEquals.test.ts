import { validTimestamp } from './BookmarkPosition/test-utils';
import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';

describe('BookmarkPosition range and equals', () => {
  describe('isWithinRange', () => {
    it('returns true when range exceeds distance in same Surah', () => {
      const a = new BookmarkPosition(1, 1, validTimestamp);
      const b = new BookmarkPosition(1, 3, validTimestamp);
      expect(a.isWithinRange(b, 5)).toBe(true);
    });

    it('returns true when range equals distance in same Surah', () => {
      const a = new BookmarkPosition(1, 1, validTimestamp);
      const b = new BookmarkPosition(1, 3, validTimestamp);
      expect(a.isWithinRange(b, 2)).toBe(true);
    });

    it('returns false when outside range in same Surah', () => {
      const a = new BookmarkPosition(1, 1, validTimestamp);
      const b = new BookmarkPosition(1, 6, validTimestamp);
      expect(a.isWithinRange(b, 3)).toBe(false);
    });

    it('returns false for positions in different Surahs', () => {
      const a = new BookmarkPosition(1, 1, validTimestamp);
      const b = new BookmarkPosition(2, 1, validTimestamp);
      expect(a.isWithinRange(b, 100)).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true for same Surah and Ayah', () => {
      const a = new BookmarkPosition(1, 5, validTimestamp);
      const b = new BookmarkPosition(1, 5, new Date());
      expect(a.equals(b)).toBe(true);
    });

    it('returns false for different Surah', () => {
      const a = new BookmarkPosition(1, 5, validTimestamp);
      const b = new BookmarkPosition(2, 5, validTimestamp);
      expect(a.equals(b)).toBe(false);
    });

    it('returns false for different Ayah', () => {
      const a = new BookmarkPosition(1, 5, validTimestamp);
      const b = new BookmarkPosition(1, 6, validTimestamp);
      expect(a.equals(b)).toBe(false);
    });
  });
});
