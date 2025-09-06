import { BookmarkPosition } from '../../../../src/domain/value-objects/BookmarkPosition';

describe('BookmarkPosition comparison', () => {
  const validTimestamp = new Date('2024-01-01T10:00:00Z');

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
});
