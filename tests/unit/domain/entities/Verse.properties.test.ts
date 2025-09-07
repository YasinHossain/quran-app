import { validId, validArabicText, validUthmaniText } from './Verse/test-utils';
import { Verse } from '../../../../src/domain/entities';

describe('Verse properties', () => {
  it('verseKey returns correct format', () => {
    const verse = new Verse(validId, 2, 255, validArabicText, validUthmaniText);
    expect(verse.verseKey).toBe('2:255');
  });

  it('isFirstVerse returns true for ayah 1 and false otherwise', () => {
    const v1 = new Verse(validId, 1, 1, validArabicText, validUthmaniText);
    const v2 = new Verse(validId, 1, 2, validArabicText, validUthmaniText);
    expect(v1.isFirstVerse()).toBe(true);
    expect(v2.isFirstVerse()).toBe(false);
  });
});
