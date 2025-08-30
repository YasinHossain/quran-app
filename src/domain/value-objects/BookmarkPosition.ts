/**
 * Value object representing the position of a bookmark in the Quran.
 * Immutable and encapsulates position-related logic.
 */
export class BookmarkPosition {
  constructor(
    private readonly _surahId: number,
    private readonly _ayahNumber: number,
    private readonly _timestamp: Date
  ) {
    if (_surahId < 1 || _surahId > 114)
      throw new Error('Invalid Surah ID: must be between 1 and 114');
    if (_ayahNumber < 1) throw new Error('Ayah number must be positive');
    if (!_timestamp) throw new Error('Timestamp is required');
  }

  // Getters
  get surahId(): number {
    return this._surahId;
  }
  get ayahNumber(): number {
    return this._ayahNumber;
  }
  get timestamp(): Date {
    return this._timestamp;
  }

  // Business Logic Methods

  /**
   * Returns the verse key in format "surah:ayah" (e.g., "1:1")
   */
  toString(): string {
    return `${this._surahId}:${this._ayahNumber}`;
  }

  /**
   * Returns the verse key (alias for toString for clarity)
   */
  get verseKey(): string {
    return this.toString();
  }

  /**
   * Checks if this position is at the beginning of a Surah
   */
  isFirstVerse(): boolean {
    return this._ayahNumber === 1;
  }

  /**
   * Checks if this position is in a specific Surah
   */
  isInSurah(surahId: number): boolean {
    return this._surahId === surahId;
  }

  /**
   * Gets the next verse position in the same Surah
   * Returns null if this is the last verse (requires Surah info to determine)
   */
  getNextVerse(maxAyahInSurah: number): BookmarkPosition | null {
    if (this._ayahNumber >= maxAyahInSurah) return null;

    return new BookmarkPosition(this._surahId, this._ayahNumber + 1, new Date());
  }

  /**
   * Gets the previous verse position in the same Surah
   * Returns null if this is the first verse
   */
  getPreviousVerse(): BookmarkPosition | null {
    if (this._ayahNumber <= 1) return null;

    return new BookmarkPosition(this._surahId, this._ayahNumber - 1, new Date());
  }

  /**
   * Compares this position with another for ordering
   * Returns negative if this comes before other, positive if after, 0 if equal
   */
  compareTo(other: BookmarkPosition): number {
    if (this._surahId !== other._surahId) {
      return this._surahId - other._surahId;
    }
    return this._ayahNumber - other._ayahNumber;
  }

  /**
   * Checks if this position comes before another position
   */
  isBefore(other: BookmarkPosition): boolean {
    return this.compareTo(other) < 0;
  }

  /**
   * Checks if this position comes after another position
   */
  isAfter(other: BookmarkPosition): boolean {
    return this.compareTo(other) > 0;
  }

  /**
   * Checks if this position is in the same Surah as another position
   */
  isInSameSurah(other: BookmarkPosition): boolean {
    return this._surahId === other._surahId;
  }

  /**
   * Gets the distance in verses from another position (within same Surah)
   * Returns null if positions are in different Surahs
   */
  getDistanceFrom(other: BookmarkPosition): number | null {
    if (!this.isInSameSurah(other)) return null;
    return Math.abs(this._ayahNumber - other._ayahNumber);
  }

  /**
   * Checks if this position is within a range of verses from another position
   */
  isWithinRange(other: BookmarkPosition, maxDistance: number): boolean {
    const distance = this.getDistanceFrom(other);
    return distance !== null && distance <= maxDistance;
  }

  /**
   * Gets a human-readable description of this position
   */
  getDisplayText(): string {
    return `Surah ${this._surahId}, Verse ${this._ayahNumber}`;
  }

  /**
   * Checks equality with another position
   */
  equals(other: BookmarkPosition): boolean {
    return this._surahId === other._surahId && this._ayahNumber === other._ayahNumber;
  }

  /**
   * Creates a copy with a new timestamp
   */
  withNewTimestamp(): BookmarkPosition {
    return new BookmarkPosition(this._surahId, this._ayahNumber, new Date());
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject() {
    return {
      surahId: this._surahId,
      ayahNumber: this._ayahNumber,
      verseKey: this.verseKey,
      timestamp: this._timestamp.toISOString(),
      isFirstVerse: this.isFirstVerse(),
      displayText: this.getDisplayText(),
    };
  }

  /**
   * Creates a BookmarkPosition from a verse key string (e.g., "1:1")
   */
  static fromVerseKey(verseKey: string): BookmarkPosition {
    const parts = verseKey.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid verse key format. Expected "surah:ayah"');
    }

    const surahId = parseInt(parts[0], 10);
    const ayahNumber = parseInt(parts[1], 10);

    if (isNaN(surahId) || isNaN(ayahNumber)) {
      throw new Error('Invalid verse key: surah and ayah must be numbers');
    }

    return new BookmarkPosition(surahId, ayahNumber, new Date());
  }
}
