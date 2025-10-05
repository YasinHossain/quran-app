import { Verse } from '@/src/domain/entities';

import {
  validId,
  validSurahId,
  validAyahNumber,
  validArabicText,
  validUthmaniText,
} from './Verse/test-utils';

describe('Verse constructor (invalid cases)', () => {
  const base = {
    id: validId,
    surahId: validSurahId,
    ayahNumber: validAyahNumber,
    arabicText: validArabicText,
    uthmaniText: validUthmaniText,
  } as const;

  it.each([
    [{ ...base, id: '' }, 'Verse ID cannot be empty'],
    [{ ...base, surahId: 0 }, 'Invalid Surah ID'],
    [{ ...base, surahId: 115 }, 'Invalid Surah ID'],
    [{ ...base, ayahNumber: 0 }, 'Invalid Ayah number'],
    [{ ...base, arabicText: '' }, 'Arabic text cannot be empty'],
    [{ ...base, arabicText: '   ' }, 'Arabic text cannot be empty'],
    [{ ...base, uthmaniText: '' }, 'Uthmani text cannot be empty'],
  ])('throws error: %s', (props, message) => {
    expect(() => new Verse(props as unknown as ConstructorParameters<typeof Verse>[0])).toThrow(
      message
    );
  });
});
