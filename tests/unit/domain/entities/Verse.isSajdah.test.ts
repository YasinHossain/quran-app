import { isSajdahVerse } from '../../../../src/domain/entities';

describe('Verse isSajdahVerse', () => {
  it('returns true for known sajdah verses', () => {
    expect(isSajdahVerse(7, 206)).toBe(true);
  });

  it('returns false for non-sajdah verses', () => {
    expect(isSajdahVerse(1, 1)).toBe(false);
  });

  it('returns true for multiple sajdah verses', () => {
    const sajdahVerses = [
      { surah: 13, ayah: 15 },
      { surah: 16, ayah: 50 },
      { surah: 32, ayah: 15 },
      { surah: 96, ayah: 19 },
    ];
    sajdahVerses.forEach(({ surah, ayah }) => {
      expect(isSajdahVerse(surah, ayah)).toBe(true);
    });
  });
});
