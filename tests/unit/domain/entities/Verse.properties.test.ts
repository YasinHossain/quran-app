import { Verse } from '@/src/domain/entities';

import { validId, validArabicText, validUthmaniText } from './Verse/test-utils';

describe('Verse properties', () => {
  it('verseKey returns correct format', () => {
    const verse = new Verse({
      id: validId,
      surahId: 2,
      ayahNumber: 255,
      arabicText: validArabicText,
      uthmaniText: validUthmaniText,
    });
    expect(verse.verseKey).toBe('2:255');
  });

  it('isFirstVerse returns true for ayah 1 and false otherwise', () => {
    const v1 = new Verse({
      id: validId,
      surahId: 1,
      ayahNumber: 1,
      arabicText: validArabicText,
      uthmaniText: validUthmaniText,
    });
    const v2 = new Verse({
      id: validId,
      surahId: 1,
      ayahNumber: 2,
      arabicText: validArabicText,
      uthmaniText: validUthmaniText,
    });
    expect(v1.isFirstVerse()).toBe(true);
    expect(v2.isFirstVerse()).toBe(false);
  });
});
