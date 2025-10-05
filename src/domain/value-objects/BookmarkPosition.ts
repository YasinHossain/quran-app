import * as comparison from './bookmarkPosition/comparison';
import * as navigation from './bookmarkPosition/navigation';

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

  get verseKey(): string {
    return `${this.surahId}:${this.ayahNumber}`;
  }

  toString(): string {
    return this.verseKey;
  }

  isFirstVerse(): boolean {
    return this.ayahNumber === 1;
  }

  isInSurah(surahId: number): boolean {
    return this.surahId === surahId;
  }

  getNextVerse(maxAyahInSurah: number): BookmarkPosition | null {
    return navigation.getNextVerse<BookmarkPosition>(this, maxAyahInSurah, BookmarkPosition);
  }

  getPreviousVerse(): BookmarkPosition | null {
    return navigation.getPreviousVerse<BookmarkPosition>(this, BookmarkPosition);
  }

  compareTo(other: BookmarkPosition): number {
    return comparison.compareTo(this, other);
  }

  isBefore(other: BookmarkPosition): boolean {
    return comparison.isBefore(this, other);
  }

  isAfter(other: BookmarkPosition): boolean {
    return comparison.isAfter(this, other);
  }

  isInSameSurah(other: BookmarkPosition): boolean {
    return comparison.isInSameSurah(this, other);
  }

  getDistanceFrom(other: BookmarkPosition): number | null {
    return comparison.getDistanceFrom(this, other);
  }

  isWithinRange(other: BookmarkPosition, maxDistance: number): boolean {
    return comparison.isWithinRange(this, other, maxDistance);
  }

  getDisplayText(): string {
    return `Surah ${this.surahId}, Verse ${this.ayahNumber}`;
  }

  equals(other: BookmarkPosition): boolean {
    return this.surahId === other.surahId && this.ayahNumber === other.ayahNumber;
  }

  withNewTimestamp(): BookmarkPosition {
    return new BookmarkPosition(this.surahId, this.ayahNumber, new Date());
  }

  toPlainObject(): BookmarkPositionPlainObject {
    return {
      surahId: this.surahId,
      ayahNumber: this.ayahNumber,
      verseKey: this.verseKey,
      timestamp: this.timestamp.toISOString(),
      isFirstVerse: this.isFirstVerse(),
      displayText: this.getDisplayText(),
    };
  }

  static fromVerseKey(verseKey: string): BookmarkPosition {
    const normalizedKey = verseKey.trim();

    if (!normalizedKey) {
      throw new Error('Invalid verse key format. Expected "surah:ayah"');
    }

    const delimiterCount = (normalizedKey.match(/:/g) ?? []).length;
    if (delimiterCount !== 1) {
      throw new Error('Invalid verse key format. Expected "surah:ayah"');
    }

    const [rawSurah, rawAyah] = normalizedKey.split(':');
    if (rawSurah === undefined || rawAyah === undefined) {
      throw new Error('Invalid verse key format. Expected "surah:ayah"');
    }

    const surahStr = rawSurah.trim();
    const ayahStr = rawAyah.trim();

    if (surahStr.length === 0 || ayahStr.length === 0) {
      throw new Error('Invalid verse key: surah and ayah must be numbers');
    }

    const surahId = Number.parseInt(surahStr, 10);
    const ayahNumber = Number.parseInt(ayahStr, 10);

    if (!Number.isInteger(surahId) || !Number.isInteger(ayahNumber)) {
      throw new Error('Invalid verse key: surah and ayah must be numbers');
    }

    return new BookmarkPosition(surahId, ayahNumber, new Date());
  }
}

export interface BookmarkPositionPlainObject {
  surahId: number;
  ayahNumber: number;
  verseKey: string;
  timestamp: string;
  isFirstVerse: boolean;
  displayText: string;
}
