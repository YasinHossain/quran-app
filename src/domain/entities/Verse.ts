import { Translation } from '../value-objects/Translation';

export enum RevelationType {
  MAKKI = 'makki',
  MADANI = 'madani',
}

/**
 * Core domain entity representing a Quranic verse.
 * Contains business logic and invariants for verse operations.
 */
export class Verse {
  constructor(
    private readonly _id: string,
    private readonly _surahId: number,
    private readonly _ayahNumber: number,
    private readonly _arabicText: string,
    private readonly _uthmaniText: string,
    private readonly _translation?: Translation
  ) {
    if (!_id) throw new Error('Verse ID cannot be empty');
    if (_surahId < 1 || _surahId > 114) throw new Error('Invalid Surah ID');
    if (_ayahNumber < 1) throw new Error('Invalid Ayah number');
    if (!_arabicText?.trim()) throw new Error('Arabic text cannot be empty');
    if (!_uthmaniText?.trim()) throw new Error('Uthmani text cannot be empty');
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get surahId(): number {
    return this._surahId;
  }
  get ayahNumber(): number {
    return this._ayahNumber;
  }
  get arabicText(): string {
    return this._arabicText;
  }
  get uthmaniText(): string {
    return this._uthmaniText;
  }
  get translation(): Translation | undefined {
    return this._translation;
  }

  /**
   * Returns the verse key in format "surah:ayah" (e.g., "1:1")
   */
  get verseKey(): string {
    return `${this._surahId}:${this._ayahNumber}`;
  }

  // Business Logic Methods

  /**
   * Determines if this is the first verse of a Surah
   */
  isFirstVerse(): boolean {
    return this._ayahNumber === 1;
  }

  /**
   * Determines if this verse requires a sajdah (prostration)
   */
  isSajdahVerse(): boolean {
    const sajdahVerses = [
      { surah: 7, ayah: 206 },
      { surah: 13, ayah: 15 },
      { surah: 16, ayah: 50 },
      { surah: 17, ayah: 109 },
      { surah: 19, ayah: 58 },
      { surah: 22, ayah: 18 },
      { surah: 22, ayah: 77 },
      { surah: 25, ayah: 60 },
      { surah: 27, ayah: 26 },
      { surah: 32, ayah: 15 },
      { surah: 38, ayah: 24 },
      { surah: 41, ayah: 38 },
      { surah: 53, ayah: 62 },
      { surah: 84, ayah: 21 },
      { surah: 96, ayah: 19 },
    ];

    return sajdahVerses.some((v) => v.surah === this._surahId && v.ayah === this._ayahNumber);
  }

  /**
   * Splits the Arabic text into segments for memorization purposes
   */
  getMemorizationSegments(): string[] {
    return this._arabicText
      .trim()
      .split(/\s+/)
      .filter((segment) => segment.length > 0);
  }

  /**
   * Calculates estimated reading time in seconds based on average reading speed
   */
  getEstimatedReadingTime(): number {
    const wordsPerMinute = 150; // Average Arabic reading speed
    const wordCount = this.getMemorizationSegments().length;
    return Math.ceil((wordCount / wordsPerMinute) * 60);
  }

  /**
   * Checks if this verse contains Bismillah
   */
  containsBismillah(): boolean {
    return this._arabicText.includes('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
  }

  /**
   * Returns word count for the verse
   */
  getWordCount(): number {
    return this.getMemorizationSegments().length;
  }

  /**
   * Checks equality with another verse
   */
  equals(other: Verse): boolean {
    return this._id === other._id;
  }

  /**
   * Creates a copy with a new translation
   */
  withTranslation(translation: Translation): Verse {
    return new Verse(
      this._id,
      this._surahId,
      this._ayahNumber,
      this._arabicText,
      this._uthmaniText,
      translation
    );
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject() {
    return {
      id: this._id,
      surahId: this._surahId,
      ayahNumber: this._ayahNumber,
      verseKey: this.verseKey,
      arabicText: this._arabicText,
      uthmaniText: this._uthmaniText,
      translation: this._translation?.toPlainObject(),
      wordCount: this.getWordCount(),
      estimatedReadingTime: this.getEstimatedReadingTime(),
      isFirstVerse: this.isFirstVerse(),
      isSajdahVerse: this.isSajdahVerse(),
    };
  }
}
