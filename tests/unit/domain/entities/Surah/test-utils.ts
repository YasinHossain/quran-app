import { Surah, RevelationType } from '../../../../../src/domain/entities';

export const validId = 1;
export const validName = 'الفاتحة';
export const validArabicName = 'الفاتحة';
export const validEnglishName = 'Al-Fatiha';
export const validEnglishTranslation = 'The Opening';
export const validNumberOfAyahs = 7;
export const validRevelationType = RevelationType.MAKKI;
export const validRevelationOrder = 5;

export const createSurah = (
  id = validId,
  name = validName,
  arabicName = validArabicName,
  englishName = validEnglishName,
  englishTranslation = validEnglishTranslation,
  numberOfAyahs = validNumberOfAyahs,
  revelationType: RevelationType = validRevelationType,
  revelationOrder?: number
) =>
  new Surah(
    id,
    name,
    arabicName,
    englishName,
    englishTranslation,
    numberOfAyahs,
    revelationType,
    revelationOrder
  );