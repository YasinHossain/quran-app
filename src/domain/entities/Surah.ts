export enum RevelationType {
  MAKKI = 'makki',
  MADANI = 'madani',
}

/**
 * Core domain entity representing a Surah (chapter) of the Quran.
 * Contains business logic and invariants for Surah operations.
 */
export class Surah {
  constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _arabicName: string,
    private readonly _englishName: string,
    private readonly _englishTranslation: string,
    private readonly _numberOfAyahs: number,
    private readonly _revelationType: RevelationType,
    private readonly _revelationOrder?: number
  ) {
    if (_id < 1 || _id > 114) throw new Error('Invalid Surah ID: must be between 1 and 114');
    if (!_name?.trim()) throw new Error('Surah name cannot be empty');
    if (!_arabicName?.trim()) throw new Error('Arabic name cannot be empty');
    if (!_englishName?.trim()) throw new Error('English name cannot be empty');
    if (_numberOfAyahs < 1) throw new Error('Number of ayahs must be positive');
  }

  // Getters
  get id(): number {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get arabicName(): string {
    return this._arabicName;
  }
  get englishName(): string {
    return this._englishName;
  }
  get englishTranslation(): string {
    return this._englishTranslation;
  }
  get numberOfAyahs(): number {
    return this._numberOfAyahs;
  }
  get revelationType(): RevelationType {
    return this._revelationType;
  }
  get revelationOrder(): number | undefined {
    return this._revelationOrder;
  }

  // Business Logic Methods

  /**
   * Determines if this Surah was revealed in Makkah
   */
  isMakki(): boolean {
    return this._revelationType === RevelationType.MAKKI;
  }

  /**
   * Determines if this Surah was revealed in Madinah
   */
  isMadani(): boolean {
    return this._revelationType === RevelationType.MADANI;
  }

  /**
   * Determines if this Surah can be read in prayer
   * At-Tawbah (Surah 9) doesn't start with Bismillah
   */
  canBeReadInPrayer(): boolean {
    return this._id !== 9; // At-Tawbah doesn't start with Bismillah
  }

  /**
   * Determines if this Surah starts with Bismillah
   */
  startWithBismillah(): boolean {
    return this._id !== 9; // All surahs except At-Tawbah start with Bismillah
  }

  /**
   * Returns if this is a short Surah (less than 20 verses)
   */
  isShortSurah(): boolean {
    return this._numberOfAyahs < 20;
  }

  /**
   * Returns if this is a medium Surah (20-100 verses)
   */
  isMediumSurah(): boolean {
    return this._numberOfAyahs >= 20 && this._numberOfAyahs <= 100;
  }

  /**
   * Returns if this is a long Surah (more than 100 verses)
   */
  isLongSurah(): boolean {
    return this._numberOfAyahs > 100;
  }

  /**
   * Gets the difficulty level for memorization
   */
  getMemorizationDifficulty(): 'easy' | 'medium' | 'hard' {
    if (this._numberOfAyahs <= 10) return 'easy';
    if (this._numberOfAyahs <= 50) return 'medium';
    return 'hard';
  }

  /**
   * Calculates estimated reading time for the entire Surah in minutes
   */
  getEstimatedReadingTime(): number {
    const averageWordsPerVerse = 15; // Rough estimate
    const wordsPerMinute = 150;
    const totalWords = this._numberOfAyahs * averageWordsPerVerse;
    return Math.ceil(totalWords / wordsPerMinute);
  }

  /**
   * Checks if this Surah is one of the Seven Long Surahs (As-Sab' at-Tiwal)
   */
  isSevenLongSurah(): boolean {
    const sevenLongSurahs = [2, 3, 4, 5, 6, 7, 9]; // Al-Baqarah through At-Tawbah
    return sevenLongSurahs.includes(this._id);
  }

  /**
   * Checks if this Surah is one of the Mufassal (detailed) Surahs
   */
  isMufassalSurah(): boolean {
    return this._id >= 49; // From Al-Hujurat (49) to An-Nas (114)
  }

  /**
   * Returns the Juz (Para) numbers that contain this Surah
   */
  getJuzNumbers(): number[] {
    // This is a simplified mapping - in reality, this would be more complex
    // as Surahs can span multiple Juz and vice versa
    const juzMapping: Record<number, number[]> = {
      1: [1],
      2: [1, 2, 3],
      3: [3, 4],
      4: [4, 5, 6],
      5: [6, 7],
      6: [7, 8],
      7: [8, 9],
      8: [9, 10],
      9: [10, 11],
      10: [11],
      11: [11, 12],
      12: [12, 13],
      13: [13],
      // ... this would continue for all 114 surahs
    };
    return juzMapping[this._id] || [Math.ceil(this._id / 4)]; // Fallback calculation
  }

  /**
   * Checks equality with another Surah
   */
  equals(other: Surah): boolean {
    return this._id === other._id;
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject() {
    return {
      id: this._id,
      name: this._name,
      arabicName: this._arabicName,
      englishName: this._englishName,
      englishTranslation: this._englishTranslation,
      numberOfAyahs: this._numberOfAyahs,
      revelationType: this._revelationType,
      revelationOrder: this._revelationOrder,
      isMakki: this.isMakki(),
      isMadani: this.isMadani(),
      canBeReadInPrayer: this.canBeReadInPrayer(),
      startWithBismillah: this.startWithBismillah(),
      memorizationDifficulty: this.getMemorizationDifficulty(),
      estimatedReadingTime: this.getEstimatedReadingTime(),
      isShortSurah: this.isShortSurah(),
      isMediumSurah: this.isMediumSurah(),
      isLongSurah: this.isLongSurah(),
      isSevenLongSurah: this.isSevenLongSurah(),
      isMufassalSurah: this.isMufassalSurah(),
      juzNumbers: this.getJuzNumbers(),
    };
  }
}
