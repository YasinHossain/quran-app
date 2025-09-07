import { Surah, RevelationType } from '../../../../src/domain/entities';

export function createSurah(
  numberOfAyahs: number,
  id = 1,
  revelationType = RevelationType.MAKKI
): Surah {
  return new Surah(
    id,
    `Surah ${id}`,
    `السورة ${id}`,
    `Surah ${id}`,
    `The ${id}`,
    numberOfAyahs,
    revelationType
  );
}

export const validId = 1;
export const validName = 'الفاتحة';
export const validArabicName = 'الفاتحة';
export const validEnglishName = 'Al-Fatiha';
export const validEnglishTranslation = 'The Opening';
export const validNumberOfAyahs = 7;
export const validRevelationType = RevelationType.MAKKI;
export const validRevelationOrder = 5;