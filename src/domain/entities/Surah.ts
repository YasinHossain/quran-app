/**
 * Revelation type enum
 */
export enum RevelationType {
  MAKKI = 'makki',
  MADANI = 'madani',
}

import {
  getEstimatedReadingTime,
  getJuzNumbers,
  getMemorizationDifficulty,
  isLongSurah,
  isMediumSurah,
  isMufassalSurah,
  isSevenLongSurah,
  isShortSurah,
} from './surahHelpers';

/**
 * Surah domain entity representing a chapter of the Quran
 */
export class Surah {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly arabicName: string,
    public readonly englishName: string,
    public readonly englishTranslation: string,
    public readonly numberOfAyahs: number,
    public readonly revelationType: RevelationType,
    public readonly revelationOrder?: number
  ) {
    this.validateInputs();
  }

  private validateInputs(): void {
    if (this.id < 1 || this.id > 114) {
      throw new Error('Invalid Surah ID: must be between 1 and 114');
    }

    if (!this.name || this.name.trim() === '') {
      throw new Error('Surah name cannot be empty');
    }

    if (!this.arabicName || this.arabicName.trim() === '') {
      throw new Error('Arabic name cannot be empty');
    }

    if (!this.englishName || this.englishName.trim() === '') {
      throw new Error('English name cannot be empty');
    }

    if (this.numberOfAyahs < 1) {
      throw new Error('Number of ayahs must be positive');
    }
  }

  /** Checks if this Surah was revealed in Makkah */
  isMakki(): boolean {
    return this.revelationType === RevelationType.MAKKI;
  }

  /** Checks if this Surah was revealed in Madinah */
  isMadani(): boolean {
    return this.revelationType === RevelationType.MADANI;
  }

  /** Checks if this Surah can be read in prayer */
  canBeReadInPrayer(): boolean {
    return this.id !== 9; // At-Tawbah has no Bismillah
  }

  /** Checks if this Surah starts with Bismillah */
  startWithBismillah(): boolean {
    return this.id !== 9; // At-Tawbah
  }

  /** Checks equality based on ID */
  equals(other: Surah): boolean {
    return this.id === other.id;
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject(): SurahPlainObject {
    return {
      id: this.id,
      name: this.name,
      arabicName: this.arabicName,
      englishName: this.englishName,
      englishTranslation: this.englishTranslation,
      numberOfAyahs: this.numberOfAyahs,
      revelationType: this.revelationType,
      revelationOrder: this.revelationOrder,
      isMakki: this.isMakki(),
      isMadani: this.isMadani(),
      canBeReadInPrayer: this.canBeReadInPrayer(),
      startWithBismillah: this.startWithBismillah(),
      memorizationDifficulty: getMemorizationDifficulty(this.numberOfAyahs),
      estimatedReadingTime: getEstimatedReadingTime(this.numberOfAyahs),
      isShortSurah: isShortSurah(this.numberOfAyahs),
      isMediumSurah: isMediumSurah(this.numberOfAyahs),
      isLongSurah: isLongSurah(this.numberOfAyahs),
      isSevenLongSurah: isSevenLongSurah(this.id),
      isMufassalSurah: isMufassalSurah(this.id),
      juzNumbers: getJuzNumbers(this.id),
    };
  }
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
