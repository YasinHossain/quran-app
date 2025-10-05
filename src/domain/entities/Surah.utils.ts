import { RevelationType, SurahInit, SurahPlainObject } from './Surah.types';
import {
  getSurahEstimatedReadingTime,
  getJuzNumbers,
  getMemorizationDifficulty,
  isLongSurah,
  isMediumSurah,
  isMufassalSurah,
  isSevenLongSurah,
  isShortSurah,
} from './surahHelpers';

import type { Surah } from './Surah';

export const isMakki = (revelationType: RevelationType): boolean =>
  revelationType === RevelationType.MAKKI;

export const isMadani = (revelationType: RevelationType): boolean =>
  revelationType === RevelationType.MADANI;

export const canBeReadInPrayer = (id: number): boolean => id !== 9;

export const startWithBismillah = (id: number): boolean => id !== 9;

export function validateSurahInputs({
  id,
  name,
  arabicName,
  englishName,
  numberOfAyahs,
}: Pick<SurahInit, 'id' | 'name' | 'arabicName' | 'englishName' | 'numberOfAyahs'>): void {
  if (id < 1 || id > 114) {
    throw new Error('Invalid Surah ID: must be between 1 and 114');
  }

  if (!name || name.trim() === '') {
    throw new Error('Surah name cannot be empty');
  }

  if (!arabicName || arabicName.trim() === '') {
    throw new Error('Arabic name cannot be empty');
  }

  if (!englishName || englishName.trim() === '') {
    throw new Error('English name cannot be empty');
  }

  if (numberOfAyahs < 1) {
    throw new Error('Number of ayahs must be positive');
  }
}

export const toPlainObject = (surah: Surah): SurahPlainObject => ({
  id: surah.id,
  name: surah.name,
  arabicName: surah.arabicName,
  englishName: surah.englishName,
  englishTranslation: surah.englishTranslation,
  numberOfAyahs: surah.numberOfAyahs,
  revelationType: surah.revelationType,
  ...(surah.revelationOrder !== undefined ? { revelationOrder: surah.revelationOrder } : {}),
  isMakki: isMakki(surah.revelationType),
  isMadani: isMadani(surah.revelationType),
  canBeReadInPrayer: canBeReadInPrayer(surah.id),
  startWithBismillah: startWithBismillah(surah.id),
  memorizationDifficulty: getMemorizationDifficulty(surah.numberOfAyahs),
  estimatedReadingTime: getSurahEstimatedReadingTime(surah.numberOfAyahs),
  isShortSurah: isShortSurah(surah.numberOfAyahs),
  isMediumSurah: isMediumSurah(surah.numberOfAyahs),
  isLongSurah: isLongSurah(surah.numberOfAyahs),
  isSevenLongSurah: isSevenLongSurah(surah.id),
  isMufassalSurah: isMufassalSurah(surah.id),
  juzNumbers: getJuzNumbers(surah.id),
});
