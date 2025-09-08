import { validTimestamp } from './BookmarkPosition/test-utils';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';

describe('BookmarkPosition surah and distance', () => {
  describe('isInSameSurah', () => {
    it('returns true for positions in same Surah', () => {
      const a = new BookmarkPosition(1, 1, validTimestamp);
      const b = new BookmarkPosition(1, 7, validTimestamp);
      expect(a.isInSameSurah(b)).toBe(true);
    });

    it('returns false for positions in different Surahs', () => {
      const a = new BookmarkPosition(1, 7, validTimestamp);
      const b = new BookmarkPosition(2, 1, validTimestamp);
      expect(a.isInSameSurah(b)).toBe(false);
    });
  });

  describe('getDistanceFrom', () => {
    it('returns correct distance from earlier to later ayah', () => {
      const start = new BookmarkPosition(1, 1, validTimestamp);
      const end = new BookmarkPosition(1, 5, validTimestamp);
      expect(start.getDistanceFrom(end)).toBe(4);
    });

    it('returns correct distance from later to earlier ayah', () => {
      const end = new BookmarkPosition(1, 5, validTimestamp);
      const start = new BookmarkPosition(1, 1, validTimestamp);
      expect(end.getDistanceFrom(start)).toBe(4);
    });

    it('returns null for positions in different Surahs', () => {
      const a = new BookmarkPosition(1, 1, validTimestamp);
      const b = new BookmarkPosition(2, 1, validTimestamp);
      expect(a.getDistanceFrom(b)).toBeNull();
    });

    it('returns 0 for same positions', () => {
      const a = new BookmarkPosition(1, 5, validTimestamp);
      const b = new BookmarkPosition(1, 5, new Date());
      expect(a.getDistanceFrom(b)).toBe(0);
    });
  });
});
