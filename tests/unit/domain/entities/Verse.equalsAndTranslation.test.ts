import { createVerse } from './Verse/test-utils';
import { Verse } from '@/src/domain/entities';
import { Translation } from '@/src/domain/value-objects/Translation';

describe('Verse equals and withTranslation', () => {
  it('equals returns true for verses with same ID and false otherwise', () => {
    const verse1 = createVerse();
    const verse2 = new Verse({
      id: verse1.id,
      surahId: 2,
      ayahNumber: 2,
      arabicText: 'different text',
      uthmaniText: 'different uthmani',
    });
    const verse3 = new Verse({
      id: 'verse-1-2',
      surahId: verse1.surahId,
      ayahNumber: verse1.ayahNumber,
      arabicText: verse1.arabicText,
      uthmaniText: verse1.uthmaniText,
    });
    expect(verse1.equals(verse2)).toBe(true);
    expect(verse1.equals(verse3)).toBe(false);
  });

  it('withTranslation returns new verse with translation', () => {
    const original = createVerse();
    const translation = new Translation({ id: 1, resourceId: 1, text: 'Test translation' });
    const updated = original.withTranslation(translation);
    expect(updated.translation).toBe(translation);
    expect(updated).not.toBe(original);
    expect(updated.id).toBe(original.id);
  });
});
