/**
 * Revelation type enum
 */
export enum RevelationType {
  MAKKI = 'makki',
  MADANI = 'madani',
}

/**
 * Surah domain entity representing a chapter of the Quran
 */
export class Surah {
  private static readonly SEVEN_LONG_SURAHS = [2, 3, 4, 5, 6, 7, 9];
  private static readonly WORDS_PER_VERSE = 15; // Estimated average
  private static readonly WORDS_PER_MINUTE = 150; // Reading speed

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

  /**
   * Checks if this Surah was revealed in Makkah
   */
  isMakki(): boolean {
    return this.revelationType === RevelationType.MAKKI;
  }

  /**
   * Checks if this Surah was revealed in Madinah
   */
  isMadani(): boolean {
    return this.revelationType === RevelationType.MADANI;
  }

  /**
   * Checks if this Surah can be read in prayer
   * At-Tawbah (Surah 9) traditionally not read in prayer due to no Bismillah
   */
  canBeReadInPrayer(): boolean {
    return this.id !== 9; // At-Tawbah
  }

  /**
   * Checks if this Surah starts with Bismillah
   * At-Tawbah (Surah 9) is the only one that doesn't
   */
  startWithBismillah(): boolean {
    return this.id !== 9; // At-Tawbah
  }

  /**
   * Classifies Surah as short (< 20 verses)
   */
  isShortSurah(): boolean {
    return this.numberOfAyahs < 20;
  }

  /**
   * Classifies Surah as medium (20-100 verses)
   */
  isMediumSurah(): boolean {
    return this.numberOfAyahs >= 20 && this.numberOfAyahs <= 100;
  }

  /**
   * Classifies Surah as long (> 100 verses)
   */
  isLongSurah(): boolean {
    return this.numberOfAyahs > 100;
  }

  /**
   * Estimates memorization difficulty based on length
   */
  getMemorizationDifficulty(): 'easy' | 'medium' | 'hard' {
    if (this.numberOfAyahs <= 10) return 'easy';
    if (this.numberOfAyahs <= 50) return 'medium';
    return 'hard';
  }

  /**
   * Estimates reading time in minutes
   */
  getEstimatedReadingTime(): number {
    const totalWords = this.numberOfAyahs * Surah.WORDS_PER_VERSE;
    const timeInMinutes = totalWords / Surah.WORDS_PER_MINUTE;
    return Math.ceil(timeInMinutes);
  }

  /**
   * Checks if this is one of the Seven Long Surahs (As-Sab' al-Tiwal)
   */
  isSevenLongSurah(): boolean {
    return Surah.SEVEN_LONG_SURAHS.includes(this.id);
  }

  /**
   * Checks if this is a Mufassal Surah (detailed ones, from Surah 49 onwards)
   */
  isMufassalSurah(): boolean {
    return this.id >= 49;
  }

  /**
   * Returns the Juz (Para) numbers this Surah spans
   * This is a simplified implementation - in practice would use actual Juz data
   */
  getJuzNumbers(): number[] {
    // Simplified mapping - in real implementation would use proper Juz boundaries
    const juzStart = Math.ceil((this.id / 114) * 30);
    return [Math.max(1, Math.min(30, juzStart))];
  }

  /**
   * Checks equality based on ID
   */
  equals(other: Surah): boolean {
    return this.id === other.id;
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject() {
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
