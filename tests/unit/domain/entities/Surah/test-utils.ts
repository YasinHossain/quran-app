import { Surah, RevelationType } from '../../../../../src/domain/entities';

export const validId = 1;
export const validName = 'الفاتحة';
export const validArabicName = 'الفاتحة';
export const validEnglishName = 'Al-Fatiha';
export const validEnglishTranslation = 'The Opening';
export const validNumberOfAyahs = 7;
export const validRevelationType = RevelationType.MAKKI;
export const validRevelationOrder = 5;

interface SurahProps {
  id?: number;
  name?: string;
  arabicName?: string;
  englishName?: string;
  englishTranslation?: string;
  numberOfAyahs?: number;
  revelationType?: RevelationType;
  revelationOrder?: number;
}

const defaultProps: Required<Omit<SurahProps, 'revelationOrder'>> = {
  id: validId,
  name: validName,
  arabicName: validArabicName,
  englishName: validEnglishName,
  englishTranslation: validEnglishTranslation,
  numberOfAyahs: validNumberOfAyahs,
  revelationType: validRevelationType,
};

export function createSurah(overrides: SurahProps = {}): Surah {
  const props = { ...defaultProps, ...overrides };
  return new Surah(
    props.id,
    props.name,
    props.arabicName,
    props.englishName,
    props.englishTranslation,
    props.numberOfAyahs,
    props.revelationType,
    props.revelationOrder
  );
}

export { RevelationType };
