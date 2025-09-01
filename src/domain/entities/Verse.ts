import { Translation } from '../value-objects/Translation';

/**
 * Verse domain entity representing a single Quranic verse
 */
export class Verse {
  private static readonly SAJDAH_VERSES = [
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

  private static readonly WORDS_PER_MINUTE = 150; // Average Arabic reading speed

  constructor(
    public readonly id: string,
    public readonly surahId: number,
    public readonly ayahNumber: number,
    public readonly arabicText: string,
    public readonly uthmaniText: string,
    public readonly translation?: Translation
  ) {
    this.validateInputs();
  }

  private validateInputs(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('Verse ID cannot be empty');
    }

    if (this.surahId < 1 || this.surahId > 114) {
      throw new Error('Invalid Surah ID');
    }

    if (this.ayahNumber < 1) {
      throw new Error('Invalid Ayah number');
    }

    if (!this.arabicText || this.arabicText.trim() === '') {
      throw new Error('Arabic text cannot be empty');
    }

    if (!this.uthmaniText || this.uthmaniText.trim() === '') {
      throw new Error('Uthmani text cannot be empty');
    }
  }

  /**
   * Returns the verse key in format "surah:ayah"
   */
  get verseKey(): string {
    return `${this.surahId}:${this.ayahNumber}`;
  }

  /**
   * Checks if this is the first verse of a Surah
   */
  isFirstVerse(): boolean {
    return this.ayahNumber === 1;
  }

  /**
   * Checks if this verse requires prostration (sajdah)
   */
  isSajdahVerse(): boolean {
    return Verse.SAJDAH_VERSES.some(
      (sajdah) => sajdah.surah === this.surahId && sajdah.ayah === this.ayahNumber
    );
  }

  /**
   * Splits the Arabic text into segments for memorization
   */
  getMemorizationSegments(): string[] {
    return this.arabicText
      .split(/\s+/)
      .map((segment) => segment.trim())
      .filter((segment) => segment.length > 0);
  }

  /**
   * Estimates reading time in seconds
   */
  getEstimatedReadingTime(): number {
    const wordCount = this.getWordCount();
    const timeInSeconds = Math.ceil((wordCount / Verse.WORDS_PER_MINUTE) * 60);
    return Math.max(timeInSeconds, 1); // Minimum 1 second
  }

  /**
   * Checks if the verse contains Bismillah
   */
  containsBismillah(): boolean {
    return this.arabicText.includes('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
  }

  /**
   * Returns the word count of the Arabic text
   */
  getWordCount(): number {
    return this.arabicText.split(/\s+/).filter((word) => word.trim().length > 0).length;
  }

  /**
   * Checks equality based on ID
   */
  equals(other: Verse): boolean {
    return this.id === other.id;
  }

  /**
   * Creates a new verse instance with translation
   */
  withTranslation(translation: Translation): Verse {
    return new Verse(
      this.id,
      this.surahId,
      this.ayahNumber,
      this.arabicText,
      this.uthmaniText,
      translation
    );
  }

  /**
   * Converts to plain object for serialization
   */
  toPlainObject() {
    return {
      id: this.id,
      surahId: this.surahId,
      ayahNumber: this.ayahNumber,
      verseKey: this.verseKey,
      arabicText: this.arabicText,
      uthmaniText: this.uthmaniText,
      translation: this.translation?.toPlainObject(),
      wordCount: this.getWordCount(),
      estimatedReadingTime: this.getEstimatedReadingTime(),
      isFirstVerse: this.isFirstVerse(),
      isSajdahVerse: this.isSajdahVerse(),
    };
  }
}
