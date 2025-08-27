/**
 * Domain Entity: Verse
 *
 * Represents a Quranic verse with content, translations, and word data.
 * Focused on current application needs.
 */

import { Word, WordStorageData } from './Word';

export interface Translation {
  id?: number;
  resource_id: number;
  text: string;
  language?: string;
  author?: string;
}

export interface Audio {
  url: string;
  reciter?: string;
  quality?: 'low' | 'medium' | 'high';
  duration?: number;
}

export class Verse {
  private constructor(
    public readonly id: number,
    public readonly verse_key: string,
    public readonly text_uthmani: string,
    public readonly audio?: Audio,
    public readonly translations?: Translation[],
    public readonly words?: Word[]
  ) {}

  /**
   * Factory method to create verse from API data
   */
  static fromApiData(data: {
    id: number;
    verse_key: string;
    text_uthmani: string;
    audio?: Audio;
    translations?: Translation[];
    words?: unknown[];
  }): Verse {
    const words = data.words?.map((w) =>
      Word.fromApiData(w as Parameters<typeof Word.fromApiData>[0])
    );
    return new Verse(
      data.id,
      data.verse_key,
      data.text_uthmani,
      data.audio,
      data.translations,
      words
    );
  }

  /**
   * Get verse coordinates (surah and ayah numbers)
   */
  getCoordinates(): { surahId: number; ayahNumber: number } {
    const [surahId, ayahNumber] = this.verse_key.split(':').map(Number);
    return { surahId, ayahNumber };
  }

  /**
   * Get primary translation text
   */
  getPrimaryTranslation(): string | null {
    return this.translations?.[0]?.text || null;
  }

  /**
   * Get translation by resource ID
   */
  getTranslationByResourceId(resourceId: number): Translation | null {
    return this.translations?.find((t) => t.resource_id === resourceId) || null;
  }

  /**
   * Get all available translation languages
   */
  getAvailableLanguages(): string[] {
    if (!this.translations) return [];
    return [...new Set(this.translations.map((t) => t.language).filter(Boolean))] as string[];
  }

  /**
   * Check if verse has audio
   */
  hasAudio(): boolean {
    return !!this.audio?.url;
  }

  /**
   * Check if verse has word-by-word data
   */
  hasWordData(): boolean {
    return !!(this.words && this.words.length > 0);
  }

  /**
   * Update words (returns new instance - immutable)
   */
  withWords(words: Word[]): Verse {
    return new Verse(
      this.id,
      this.verse_key,
      this.text_uthmani,
      this.audio,
      this.translations,
      words
    );
  }

  /**
   * Get verse text with optional formatting
   */
  getFormattedText(
    options: {
      includeTashkeel?: boolean;
      fontFamily?: string;
      tajweed?: boolean;
    } = {}
  ): string {
    let text = this.text_uthmani;

    if (options.includeTashkeel === false) {
      // Remove diacritical marks for simplified reading
      text = text.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
    }

    return text;
  }

  /**
   * Get word count
   */
  getWordCount(): number {
    return this.words?.length || 0;
  }

  /**
   * Search for specific words in the verse
   */
  containsWord(searchTerm: string): boolean {
    if (!this.words) return false;

    return this.words.some(
      (word) =>
        word.getArabicText().includes(searchTerm) ||
        word.getTranslation()?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Get reading time estimate (words per minute for Arabic)
   */
  getEstimatedReadingTime(wpm: number = 150): number {
    const wordCount = this.getWordCount() || this.text_uthmani.split(' ').length;
    return Math.ceil(wordCount / wpm);
  }

  /**
   * Convert to storage format
   */
  toStorage(): VerseStorageData {
    return {
      id: this.id,
      verse_key: this.verse_key,
      text_uthmani: this.text_uthmani,
      audio: this.audio,
      translations: this.translations,
      words: this.words?.map((w) => w.toStorage()),
    };
  }
}

export interface VerseStorageData {
  id: number;
  verse_key: string;
  text_uthmani: string;
  audio?: Audio;
  translations?: Translation[];
  words?: WordStorageData[];
}
