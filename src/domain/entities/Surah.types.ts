export enum RevelationType {
  MAKKI = 'makki',
  MADANI = 'madani',
}

export interface SurahInit {
  id: number;
  name: string;
  arabicName: string;
  englishName: string;
  englishTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
  revelationOrder?: number;
}

export interface SurahPlainObject {
  id: number;
  name: string;
  arabicName: string;
  englishName: string;
  englishTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
  revelationOrder?: number;
  isMakki: boolean;
  isMadani: boolean;
  canBeReadInPrayer: boolean;
  startWithBismillah: boolean;
  memorizationDifficulty: 'easy' | 'medium' | 'hard';
  estimatedReadingTime: number;
  isShortSurah: boolean;
  isMediumSurah: boolean;
  isLongSurah: boolean;
  isSevenLongSurah: boolean;
  isMufassalSurah: boolean;
  juzNumbers: number[];
}
