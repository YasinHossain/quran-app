import { Surah, RevelationType } from '../../../../src/domain/entities';

interface SurahProps {
  id: number;
  name: string;
  arabicName: string;
  englishName: string;
  englishTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
}

const defaultProps: SurahProps = {
  id: 1,
  name: 'الفاتحة',
  arabicName: 'الفاتحة',
  englishName: 'Al-Fatiha',
  englishTranslation: 'The Opening',
  numberOfAyahs: 7,
  revelationType: RevelationType.MAKKI,
};

export function createSurah(overrides: Partial<SurahProps> = {}): Surah {
  const props = { ...defaultProps, ...overrides };
  return new Surah(
    props.id,
    props.name,
    props.arabicName,
    props.englishName,
    props.englishTranslation,
    props.numberOfAyahs,
    props.revelationType
  );
}

export { RevelationType };
