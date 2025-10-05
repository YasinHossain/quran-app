import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';

import { validTimestamp } from './BookmarkPosition/test-utils';

describe('BookmarkPosition compareTo', () => {
  it('returns negative when this comes before other', () => {
    const a = new BookmarkPosition(1, 5, validTimestamp);
    const b = new BookmarkPosition(1, 6, validTimestamp);
    expect(a.compareTo(b)).toBeLessThan(0);
  });

  it('returns positive when this comes after other', () => {
    const a = new BookmarkPosition(1, 6, validTimestamp);
    const b = new BookmarkPosition(1, 5, validTimestamp);
    expect(a.compareTo(b)).toBeGreaterThan(0);
  });

  it('returns zero when positions are equal', () => {
    const a = new BookmarkPosition(1, 5, validTimestamp);
    const b = new BookmarkPosition(1, 5, new Date());
    expect(a.compareTo(b)).toBe(0);
  });

  it('prioritizes Surah comparison over Ayah', () => {
    const a = new BookmarkPosition(1, 100, validTimestamp);
    const b = new BookmarkPosition(2, 1, validTimestamp);
    expect(a.compareTo(b)).toBeLessThan(0);
  });

  it('handles different surahs correctly', () => {
    const a = new BookmarkPosition(2, 1, validTimestamp);
    const b = new BookmarkPosition(1, 7, validTimestamp);
    expect(a.compareTo(b)).toBeGreaterThan(0);
  });
});
