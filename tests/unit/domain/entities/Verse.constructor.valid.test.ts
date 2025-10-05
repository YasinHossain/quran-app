import { Translation } from '@/src/domain/value-objects/Translation';

import {
  validSurahId,
  validAyahNumber,
  validArabicText,
  validUthmaniText,
  createVerse,
} from './Verse/test-utils';

describe('Verse constructor (valid cases)', () => {
  it('creates a valid verse with required parameters', () => {
    const verse = createVerse();
    expect(verse.surahId).toBe(validSurahId);
    expect(verse.ayahNumber).toBe(validAyahNumber);
    expect(verse.arabicText).toBe(validArabicText);
    expect(verse.uthmaniText).toBe(validUthmaniText);
    expect(verse.translation).toBeUndefined();
  });

  it('creates a verse with translation', () => {
    const translation = new Translation({
      id: 1,
      resourceId: 1,
      text: 'In the name of Allah, the Beneficent, the Merciful.',
    });
    const verse = createVerse(translation);
    expect(verse.translation).toBe(translation);
  });
});
