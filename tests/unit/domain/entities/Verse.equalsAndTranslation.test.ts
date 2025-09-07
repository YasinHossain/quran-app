import { createVerse } from './Verse/test-utils';
import { Verse } from '../../../../src/domain/entities';
import { Translation } from '../../../../src/domain/value-objects/Translation';

describe('Verse equals and withTranslation', () => {
  it('equals returns true for verses with same ID and false otherwise', () => {
    const verse1 = createVerse();
    const verse2 = new Verse(verse1.id, 2, 2, 'different text', 'different uthmani');
    const verse3 = new Verse(
      'verse-1-2',
      verse1.surahId,
      verse1.ayahNumber,
      verse1.arabicText,
      verse1.uthmaniText
    );
    expect(verse1.equals(verse2)).toBe(true);
    expect(verse1.equals(verse3)).toBe(false);
  });

  it('withTranslation returns new verse with translation', () => {
    const original = createVerse();
    const translation = new Translation(1, 1, 'Test translation');
    const updated = original.withTranslation(translation);
    expect(updated.translation).toBe(translation);
    expect(updated).not.toBe(original);
    expect(updated.id).toBe(original.id);
  });
});
