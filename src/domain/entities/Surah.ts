import {
  canBeReadInPrayer as canBeReadInPrayerUtil,
  isMakki as isMakkiUtil,
  isMadani as isMadaniUtil,
  startWithBismillah as startWithBismillahUtil,
  toPlainObject as toPlainObjectUtil,
  validateSurahInputs,
} from './Surah.utils';

import type { RevelationType, SurahInit, SurahPlainObject } from './Surah.types';
export { RevelationType } from './Surah.types';

/**
 * Surah domain entity representing a chapter of the Quran
 */
export class Surah {
  public readonly id: number;
  public readonly name: string;
  public readonly arabicName: string;
  public readonly englishName: string;
  public readonly englishTranslation: string;
  public readonly numberOfAyahs: number;
  public readonly revelationType: RevelationType;
  public readonly revelationOrder: number | undefined;

  constructor(init: SurahInit);
  constructor(
    id: number,
    name: string,
    arabicName: string,
    englishName: string,
    englishTranslation: string,
    numberOfAyahs: number,
    revelationType: RevelationType,
    revelationOrder?: number
  );
  constructor(...args: unknown[]) {
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      const {
        id,
        name,
        arabicName,
        englishName,
        englishTranslation,
        numberOfAyahs,
        revelationType,
        revelationOrder,
      } = args[0] as SurahInit;
      this.id = id;
      this.name = name;
      this.arabicName = arabicName;
      this.englishName = englishName;
      this.englishTranslation = englishTranslation;
      this.numberOfAyahs = numberOfAyahs;
      this.revelationType = revelationType;
      this.revelationOrder = revelationOrder;
    } else {
      const [
        id,
        name,
        arabicName,
        englishName,
        englishTranslation,
        numberOfAyahs,
        revelationType,
        revelationOrder,
      ] = args as [number, string, string, string, string, number, RevelationType, number?];
      this.id = id;
      this.name = name;
      this.arabicName = arabicName;
      this.englishName = englishName;
      this.englishTranslation = englishTranslation;
      this.numberOfAyahs = numberOfAyahs;
      this.revelationType = revelationType;
      this.revelationOrder = revelationOrder;
    }
    validateSurahInputs({
      id: this.id,
      name: this.name,
      arabicName: this.arabicName,
      englishName: this.englishName,
      numberOfAyahs: this.numberOfAyahs,
    });
  }

  /** Checks if this Surah was revealed in Makkah */
  isMakki(): boolean {
    return isMakkiUtil(this.revelationType);
  }

  /** Checks if this Surah was revealed in Madinah */
  isMadani(): boolean {
    return isMadaniUtil(this.revelationType);
  }

  /** Checks if this Surah can be read in prayer */
  canBeReadInPrayer(): boolean {
    return canBeReadInPrayerUtil(this.id);
  }

  /** Checks if this Surah starts with Bismillah */
  startWithBismillah(): boolean {
    return startWithBismillahUtil(this.id);
  }

  /** Checks equality based on ID */
  equals(other: Surah): boolean {
    return this.id === other.id;
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject(): SurahPlainObject {
    return toPlainObjectUtil(this);
  }
}

export type { SurahInit, SurahPlainObject };
