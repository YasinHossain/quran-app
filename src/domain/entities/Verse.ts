import { getEstimatedReadingTime, getWordCount, isSajdahVerse } from './verseUtils';
import { Translation } from '../value-objects/Translation';

/**
 * Verse domain entity representing a single Quranic verse
 */
export class Verse {
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
      wordCount: getWordCount(this.arabicText),
      estimatedReadingTime: getEstimatedReadingTime(this.arabicText),
      isFirstVerse: this.isFirstVerse(),
      isSajdahVerse: isSajdahVerse(this.surahId, this.ayahNumber),
    };
  }
}
