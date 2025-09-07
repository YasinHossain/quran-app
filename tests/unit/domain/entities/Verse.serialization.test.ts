import { Verse, getWordCount, getEstimatedReadingTime, isSajdahVerse } from '../../../../src/domain/entities';
import { Translation } from '../../../../src/domain/value-objects/Translation';
import {
  validId,
  validSurahId,
  validAyahNumber,
  validArabicText,
  validUthmaniText,
  createVerse,
} from './Verse/test-utils';

describe('Verse serialization', () => {
  it('converts to plain object with all properties', () => {
    const translation = new Translation(1, 1, 'Test translation');
    const verse = new Verse(
      validId,
      2,
      255,
      validArabicText,
      validUthmaniText,
      translation
    );

    const plain = verse.toPlainObject();

    expect(plain).toEqual({
      id: validId,
      surahId: 2,
      ayahNumber: 255,
      verseKey: '2:255',
      arabicText: validArabicText,
      uthmaniText: validUthmaniText,
      translation: translation.toPlainObject(),
      wordCount: getWordCount(validArabicText),
      estimatedReadingTime: getEstimatedReadingTime(validArabicText),
      isFirstVerse: false,
      isSajdahVerse: isSajdahVerse(2, 255),
    });
  });

  it('omits translation when not provided', () => {
    const verse = createVerse();
    const plain = verse.toPlainObject();
    expect(plain.translation).toBeUndefined();
    expect(typeof plain).toBe('object');
  });

  it('reconstructs from plain object', () => {
    const translation = new Translation(1, 1, 'Test translation');
    const verse = createVerse(translation);
    const plain = verse.toPlainObject();

    const reconstructed = new Verse(
      plain.id,
      plain.surahId,
      plain.ayahNumber,
      plain.arabicText,
      plain.uthmaniText,
      translation
    );

    expect(reconstructed.toPlainObject()).toEqual(plain);
  });
});
