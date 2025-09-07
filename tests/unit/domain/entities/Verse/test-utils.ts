import { Verse } from '../../../../src/domain/entities';
import { Translation } from '../../../../src/domain/value-objects/Translation';

export const validId = 'verse-1-1';
export const validSurahId = 1;
export const validAyahNumber = 1;
export const validArabicText = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
export const validUthmaniText = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export function createVerse(translation?: Translation): Verse {
  return new Verse(
    validId,
    validSurahId,
    validAyahNumber,
    validArabicText,
    validUthmaniText,
    translation
  );
}
