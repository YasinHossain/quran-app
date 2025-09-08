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
      () =>
        new Verse({
          id: '',
          surahId: validSurahId,
          ayahNumber: validAyahNumber,
          arabicText: validArabicText,
          uthmaniText: validUthmaniText,
        })
    ).toThrow('Verse ID cannot be empty');
  });

  it('throws error for invalid Surah ID (below 1)', () => {
    expect(
      () =>
        new Verse({
          id: validId,
          surahId: 0,
          ayahNumber: validAyahNumber,
          arabicText: validArabicText,
          uthmaniText: validUthmaniText,
        })
    ).toThrow('Invalid Surah ID');
  });

  it('throws error for invalid Surah ID (above 114)', () => {
    expect(
      () =>
        new Verse({
          id: validId,
          surahId: 115,
          ayahNumber: validAyahNumber,
          arabicText: validArabicText,
          uthmaniText: validUthmaniText,
        })
    ).toThrow('Invalid Surah ID');
  });

  it('throws error for invalid Ayah number (below 1)', () => {
    expect(
      () =>
        new Verse({
          id: validId,
          surahId: validSurahId,
          ayahNumber: 0,
          arabicText: validArabicText,
          uthmaniText: validUthmaniText,
        })
    ).toThrow('Invalid Ayah number');
  });

  it('throws error for empty or whitespace-only Arabic text', () => {
    expect(
      () =>
        new Verse({
          id: validId,
          surahId: validSurahId,
          ayahNumber: validAyahNumber,
          arabicText: '',
          uthmaniText: validUthmaniText,
        })
    ).toThrow('Arabic text cannot be empty');
    expect(
      () =>
        new Verse({
          id: validId,
          surahId: validSurahId,
          ayahNumber: validAyahNumber,
          arabicText: '   ',
          uthmaniText: validUthmaniText,
        })
    ).toThrow('Arabic text cannot be empty');
  });

  it('throws error for empty Uthmani text', () => {
    expect(
      () =>
        new Verse({
          id: validId,
          surahId: validSurahId,
          ayahNumber: validAyahNumber,
          arabicText: validArabicText,
          uthmaniText: '',
        })
    ).toThrow('Uthmani text cannot be empty');
  });
});
