import { validTimestamp } from './BookmarkPosition/test-utils';
import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';

describe('BookmarkPosition ordering', () => {
  describe('isBefore', () => {
    it('returns true when before another', () => {
      const a = new BookmarkPosition(1, 5, validTimestamp);
      const b = new BookmarkPosition(1, 6, validTimestamp);
      expect(a.isBefore(b)).toBe(true);
    });

    it('returns false when after another', () => {
      const a = new BookmarkPosition(1, 6, validTimestamp);
      const b = new BookmarkPosition(1, 5, validTimestamp);
      expect(a.isBefore(b)).toBe(false);
    });

    it('handles cross-surah comparisons', () => {
      const a = new BookmarkPosition(1, 7, validTimestamp);
      const b = new BookmarkPosition(2, 1, validTimestamp);
      expect(a.isBefore(b)).toBe(true);
    });
  });

  describe('isAfter', () => {
    it('returns true when after another', () => {
      const a = new BookmarkPosition(1, 6, validTimestamp);
      const b = new BookmarkPosition(1, 5, validTimestamp);
      expect(a.isAfter(b)).toBe(true);
    });

    it('returns false when before another', () => {
      const a = new BookmarkPosition(1, 5, validTimestamp);
      const b = new BookmarkPosition(1, 6, validTimestamp);
      expect(a.isAfter(b)).toBe(false);
    });

    it('handles cross-surah comparisons', () => {
      const a = new BookmarkPosition(1, 7, validTimestamp);
      const b = new BookmarkPosition(2, 1, validTimestamp);
      expect(b.isAfter(a)).toBe(true);
    });
  });
});
