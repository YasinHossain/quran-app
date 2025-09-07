import { Verse } from '../../../../src/domain/entities';
import { Translation } from '../../../../src/domain/value-objects/Translation';
import {
  validId,
  validSurahId,
  validAyahNumber,
  validArabicText,
  validUthmaniText,
  createVerse,
} from './Verse/test-utils';

describe('Verse entity', () => {
  describe('constructor', () => {
    it('creates a valid verse with required parameters', () => {
      const verse = createVerse();

      expect(verse.id).toBe(validId);
      expect(verse.surahId).toBe(validSurahId);
      expect(verse.ayahNumber).toBe(validAyahNumber);
      expect(verse.arabicText).toBe(validArabicText);
      expect(verse.uthmaniText).toBe(validUthmaniText);
      expect(verse.translation).toBeUndefined();
    });

    it('creates a verse with translation', () => {
      const translation = new Translation(1, 1, 'In the name of Allah, the Beneficent, the Merciful.');
      const verse = createVerse(translation);

      expect(verse.translation).toBe(translation);
    });

    it('throws error for empty ID', () => {
      expect(
        () => new Verse('', validSurahId, validAyahNumber, validArabicText, validUthmaniText)
      ).toThrow('Verse ID cannot be empty');
    });

    it('throws error for invalid Surah ID (below 1)', () => {
      expect(
        () => new Verse(validId, 0, validAyahNumber, validArabicText, validUthmaniText)
      ).toThrow('Invalid Surah ID');
    });

    it('throws error for invalid Surah ID (above 114)', () => {
      expect(
        () => new Verse(validId, 115, validAyahNumber, validArabicText, validUthmaniText)
      ).toThrow('Invalid Surah ID');
    });

    it('throws error for invalid Ayah number (below 1)', () => {
      expect(
        () => new Verse(validId, validSurahId, 0, validArabicText, validUthmaniText)
      ).toThrow('Invalid Ayah number');
    });

    it('throws error for empty Arabic text', () => {
      expect(
        () => new Verse(validId, validSurahId, validAyahNumber, '', validUthmaniText)
      ).toThrow('Arabic text cannot be empty');
    });

    it('throws error for whitespace-only Arabic text', () => {
      expect(
        () => new Verse(validId, validSurahId, validAyahNumber, '   ', validUthmaniText)
      ).toThrow('Arabic text cannot be empty');
    });

    it('throws error for empty Uthmani text', () => {
      expect(
        () => new Verse(validId, validSurahId, validAyahNumber, validArabicText, '')
      ).toThrow('Uthmani text cannot be empty');
    });
  });

  describe('verseKey', () => {
    it('returns correct verse key format', () => {
      const verse = new Verse(validId, 2, 255, validArabicText, validUthmaniText);
      expect(verse.verseKey).toBe('2:255');
    });
  });

  describe('isFirstVerse', () => {
    it('returns true for ayah number 1', () => {
      const verse = createVerse();
      expect(verse.isFirstVerse()).toBe(true);
    });

    it('returns false for ayah numbers greater than 1', () => {
      const verse = new Verse(validId, validSurahId, 2, validArabicText, validUthmaniText);
      expect(verse.isFirstVerse()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true for verses with same ID', () => {
      const verse1 = createVerse();
      const verse2 = new Verse(validId, 2, 2, 'different text', 'different uthmani');
      expect(verse1.equals(verse2)).toBe(true);
    });

    it('returns false for verses with different IDs', () => {
      const verse1 = createVerse();
      const verse2 = new Verse('verse-1-2', validSurahId, validAyahNumber, validArabicText, validUthmaniText);
      expect(verse1.equals(verse2)).toBe(false);
    });
  });

  describe('withTranslation', () => {
    it('returns new verse with translation', () => {
      const originalVerse = createVerse();
      const translation = new Translation(1, 1, 'Test translation');
      const verseWithTranslation = originalVerse.withTranslation(translation);

      expect(verseWithTranslation.translation).toBe(translation);
      expect(verseWithTranslation).not.toBe(originalVerse);
      expect(verseWithTranslation.id).toBe(originalVerse.id);
    });
  });
});
