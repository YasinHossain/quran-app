import {
  validId,
  validSurahId,
  validAyahNumber,
  validArabicText,
  validUthmaniText,
} from './Verse/test-utils';
import { Verse } from '../../../../src/domain/entities';

describe('Verse constructor (invalid cases)', () => {
  it('throws error for empty ID', () => {
    expect(
      () => new Verse('', validSurahId, validAyahNumber, validArabicText, validUthmaniText)
    ).toThrow('Verse ID cannot be empty');
  });

  it('throws error for invalid Surah ID (below 1)', () => {
    expect(() => new Verse(validId, 0, validAyahNumber, validArabicText, validUthmaniText)).toThrow(
      'Invalid Surah ID'
    );
  });

  it('throws error for invalid Surah ID (above 114)', () => {
    expect(
      () => new Verse(validId, 115, validAyahNumber, validArabicText, validUthmaniText)
    ).toThrow('Invalid Surah ID');
  });

  it('throws error for invalid Ayah number (below 1)', () => {
    expect(() => new Verse(validId, validSurahId, 0, validArabicText, validUthmaniText)).toThrow(
      'Invalid Ayah number'
    );
  });

  it('throws error for empty or whitespace-only Arabic text', () => {
    expect(() => new Verse(validId, validSurahId, validAyahNumber, '', validUthmaniText)).toThrow(
      'Arabic text cannot be empty'
    );
    expect(
      () => new Verse(validId, validSurahId, validAyahNumber, '   ', validUthmaniText)
    ).toThrow('Arabic text cannot be empty');
  });

  it('throws error for empty Uthmani text', () => {
    expect(() => new Verse(validId, validSurahId, validAyahNumber, validArabicText, '')).toThrow(
      'Uthmani text cannot be empty'
    );
  });
});
