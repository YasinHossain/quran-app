import { Verse } from '@/src/domain/entities';
import { Translation } from '@/src/domain/value-objects/Translation';

export const validId = 'verse-1-1';
export const validSurahId = 1;
export const validAyahNumber = 1;
export const validArabicText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
export const validUthmaniText = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export function createVerse(translation?: Translation): Verse {
  const options: ConstructorParameters<typeof Verse>[0] = {
    id: validId,
    surahId: validSurahId,
    ayahNumber: validAyahNumber,
    arabicText: validArabicText,
    uthmaniText: validUthmaniText,
  };

  if (translation !== undefined) {
    options.translation = translation;
  }

  return new Verse(options);
}
