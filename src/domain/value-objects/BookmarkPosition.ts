/**
 * BookmarkPosition value object representing a position in the Quran
 */
export class BookmarkPosition {
  constructor(
    public readonly surahId: number,
    public readonly ayahNumber: number,
    public readonly timestamp: Date
  ) {
    this.validateInputs();
  }

  private validateInputs(): void {
    if (this.surahId < 1 || this.surahId > 114) {
      throw new Error('Invalid Surah ID: must be between 1 and 114');
    }

    if (this.ayahNumber < 1) {
      throw new Error('Ayah number must be positive');
    }

    if (!this.timestamp) {
      throw new Error('Timestamp is required');
    }
  }

  /**
   * Returns the verse key in format "surah:ayah"
   */
  get verseKey(): string {
    return `${this.surahId}:${this.ayahNumber}`;
  }

  /**
   * String representation returns verse key
   */
  toString(): string {
    return this.verseKey;
  }

  /**
   * Checks if this is the first verse of a Surah
   */
  isFirstVerse(): boolean {
    return this.ayahNumber === 1;
  }

  /**
   * Checks if this position is in the specified Surah
   */
  isInSurah(surahId: number): boolean {
    return this.surahId === surahId;
  }

  /**
   * Gets the next verse position within the same Surah
   */
  getNextVerse(maxAyahInSurah: number): BookmarkPosition | null {
    if (this.ayahNumber >= maxAyahInSurah) {
      return null;
    }
    return new BookmarkPosition(this.surahId, this.ayahNumber + 1, new Date());
  }

  /**
   * Gets the previous verse position within the same Surah
   */
  getPreviousVerse(): BookmarkPosition | null {
    if (this.ayahNumber <= 1) {
      return null;
    }
    return new BookmarkPosition(this.surahId, this.ayahNumber - 1, new Date());
  }

  /**
   * Compares two positions for ordering
   */
  compareTo(other: BookmarkPosition): number {
    if (this.surahId !== other.surahId) {
      return this.surahId - other.surahId;
    }
    return this.ayahNumber - other.ayahNumber;
  }

  /**
   * Checks if this position comes before another
   */
  isBefore(other: BookmarkPosition): boolean {
    return this.compareTo(other) < 0;
  }

  /**
   * Checks if this position comes after another
   */
  isAfter(other: BookmarkPosition): boolean {
    return this.compareTo(other) > 0;
  }

  /**
   * Checks if two positions are in the same Surah
   */
  isInSameSurah(other: BookmarkPosition): boolean {
    return this.surahId === other.surahId;
  }

  /**
   * Gets the distance (in verses) between two positions in the same Surah
   */
  getDistanceFrom(other: BookmarkPosition): number | null {
    if (!this.isInSameSurah(other)) {
      return null;
    }
    return Math.abs(this.ayahNumber - other.ayahNumber);
  }

  /**
   * Checks if another position is within a specified range
   */
  isWithinRange(other: BookmarkPosition, maxDistance: number): boolean {
    const distance = this.getDistanceFrom(other);
    return distance !== null && distance <= maxDistance;
  }

  /**
   * Gets human-readable display text
   */
  getDisplayText(): string {
    return `Surah ${this.surahId}, Verse ${this.ayahNumber}`;
  }

  /**
   * Checks equality based on Surah and Ayah (ignores timestamp)
   */
  equals(other: BookmarkPosition): boolean {
    return this.surahId === other.surahId && this.ayahNumber === other.ayahNumber;
  }

  /**
   * Creates a new position with updated timestamp
   */
  withNewTimestamp(): BookmarkPosition {
    return new BookmarkPosition(this.surahId, this.ayahNumber, new Date());
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject() {
    return {
      surahId: this.surahId,
      ayahNumber: this.ayahNumber,
      verseKey: this.verseKey,
      timestamp: this.timestamp.toISOString(),
      isFirstVerse: this.isFirstVerse(),
      displayText: this.getDisplayText(),
    };
  }

  /**
   * Creates a BookmarkPosition from a verse key string
   */
  static fromVerseKey(verseKey: string): BookmarkPosition {
    const parts = verseKey.split(':');

    if (parts.length !== 2) {
      throw new Error('Invalid verse key format. Expected "surah:ayah"');
    }

    const surahId = parseInt(parts[0], 10);
    const ayahNumber = parseInt(parts[1], 10);

    if (isNaN(surahId) || isNaN(ayahNumber) || parts[0].trim() === '' || parts[1].trim() === '') {
      throw new Error('Invalid verse key: surah and ayah must be numbers');
    }

    return new BookmarkPosition(surahId, ayahNumber, new Date());
  }
}
