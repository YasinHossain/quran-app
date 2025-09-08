import { validSurahId, validTimestamp } from './BookmarkPosition/test-utils';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';

describe('BookmarkPosition methods', () => {
  it('withNewTimestamp creates a new position with updated timestamp', () => {
    const original = new BookmarkPosition(validSurahId, 5, validTimestamp);
    const updated = original.withNewTimestamp();
    expect(updated.surahId).toBe(original.surahId);
    expect(updated.ayahNumber).toBe(original.ayahNumber);
    expect(updated.timestamp).not.toBe(original.timestamp);
    expect(updated).not.toBe(original);
  });

  describe('fromVerseKey', () => {
    it('parses valid keys', () => {
      const p1 = BookmarkPosition.fromVerseKey('2:255');
      expect(p1.surahId).toBe(2);
      expect(p1.ayahNumber).toBe(255);
      expect(p1.verseKey).toBe('2:255');

      const p2 = BookmarkPosition.fromVerseKey('1:1');
      expect(p2.surahId).toBe(1);
      expect(p2.ayahNumber).toBe(1);

      const p3 = BookmarkPosition.fromVerseKey('114:6');
      expect(p3.surahId).toBe(114);
      expect(p3.ayahNumber).toBe(6);
    });

    it('throws on invalid formats', () => {
      expect(() => BookmarkPosition.fromVerseKey('2255')).toThrow(
        'Invalid verse key format. Expected "surah:ayah"'
      );
      expect(() => BookmarkPosition.fromVerseKey('2:255:extra')).toThrow(
        'Invalid verse key format. Expected "surah:ayah"'
      );
      expect(() => BookmarkPosition.fromVerseKey('abc:255')).toThrow(
        'Invalid verse key: surah and ayah must be numbers'
      );
      expect(() => BookmarkPosition.fromVerseKey('2:abc')).toThrow(
        'Invalid verse key: surah and ayah must be numbers'
      );
      expect(() => BookmarkPosition.fromVerseKey(':255')).toThrow(
        'Invalid verse key: surah and ayah must be numbers'
      );
    });
  });
});
