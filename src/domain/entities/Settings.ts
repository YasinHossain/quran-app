/**
 * Domain Entity: Settings
 *
 * Represents application settings with validation and business logic.
 */

import { ARABIC_FONTS } from '../constants/fonts';

export interface ArabicFont {
  name: string;
  value: string;
  category: string;
}

export class Settings {
  private constructor(
    public readonly translationIds: number[],
    public readonly tafsirIds: number[],
    public readonly arabicFont: string,
    public readonly fontSize: number,
    public readonly showByWords: boolean,
    public readonly tajweed: boolean,
    public readonly wordLang: string,
    public readonly wordTranslationId: number,
    public readonly theme: 'light' | 'dark' | 'system'
  ) {}

  /**
   * Factory method to create settings with defaults
   */
  static createDefault(): Settings {
    return new Settings(
      [20], // Default translation ID
      [169], // Default tafsir ID
      ARABIC_FONTS[0].value, // Default Arabic font
      16, // Default font size
      false, // Show word by word
      true, // Show tajweed
      'en', // Word translation language
      20, // Word translation ID
      'system' // Theme
    );
  }

  /**
   * Factory method to create from storage data
   */
  static fromStorage(data: SettingsStorageData): Settings {
    return new Settings(
      data.translationIds || [20],
      data.tafsirIds || [169],
      data.arabicFont || ARABIC_FONTS[0].value,
      data.fontSize || 16,
      data.showByWords ?? false,
      data.tajweed ?? true,
      data.wordLang || 'en',
      data.wordTranslationId || 20,
      data.theme || 'system'
    );
  }

  /**
   * Update translation IDs (returns new instance - immutable)
   */
  withTranslationIds(translationIds: number[]): Settings {
    if (translationIds.length === 0) {
      throw new Error('At least one translation is required');
    }

    return new Settings(
      translationIds,
      this.tafsirIds,
      this.arabicFont,
      this.fontSize,
      this.showByWords,
      this.tajweed,
      this.wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Update tafsir IDs (returns new instance - immutable)
   */
  withTafsirIds(tafsirIds: number[]): Settings {
    return new Settings(
      this.translationIds,
      tafsirIds,
      this.arabicFont,
      this.fontSize,
      this.showByWords,
      this.tajweed,
      this.wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Update Arabic font (returns new instance - immutable)
   */
  withArabicFont(arabicFont: string): Settings {
    if (!this.isValidArabicFont(arabicFont)) {
      throw new Error(`Invalid Arabic font: ${arabicFont}`);
    }

    return new Settings(
      this.translationIds,
      this.tafsirIds,
      arabicFont,
      this.fontSize,
      this.showByWords,
      this.tajweed,
      this.wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Update font size (returns new instance - immutable)
   */
  withFontSize(fontSize: number): Settings {
    if (fontSize < 10 || fontSize > 32) {
      throw new Error('Font size must be between 10 and 32');
    }

    return new Settings(
      this.translationIds,
      this.tafsirIds,
      this.arabicFont,
      fontSize,
      this.showByWords,
      this.tajweed,
      this.wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Toggle word-by-word display (returns new instance - immutable)
   */
  withShowByWords(showByWords: boolean): Settings {
    return new Settings(
      this.translationIds,
      this.tafsirIds,
      this.arabicFont,
      this.fontSize,
      showByWords,
      this.tajweed,
      this.wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Toggle tajweed (returns new instance - immutable)
   */
  withTajweed(tajweed: boolean): Settings {
    return new Settings(
      this.translationIds,
      this.tafsirIds,
      this.arabicFont,
      this.fontSize,
      this.showByWords,
      tajweed,
      this.wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Update word translation language (returns new instance - immutable)
   */
  withWordLang(wordLang: string): Settings {
    if (!this.isValidLanguage(wordLang)) {
      throw new Error(`Invalid word language: ${wordLang}`);
    }

    return new Settings(
      this.translationIds,
      this.tafsirIds,
      this.arabicFont,
      this.fontSize,
      this.showByWords,
      this.tajweed,
      wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Update word translation ID (returns new instance - immutable)
   */
  withWordTranslationId(wordTranslationId: number): Settings {
    if (wordTranslationId <= 0) {
      throw new Error('Word translation ID must be positive');
    }

    return new Settings(
      this.translationIds,
      this.tafsirIds,
      this.arabicFont,
      this.fontSize,
      this.showByWords,
      this.tajweed,
      this.wordLang,
      wordTranslationId,
      this.theme
    );
  }

  /**
   * Update theme (returns new instance - immutable)
   */
  withTheme(theme: 'light' | 'dark' | 'system'): Settings {
    return new Settings(
      this.translationIds,
      this.tafsirIds,
      this.arabicFont,
      this.fontSize,
      this.showByWords,
      this.tajweed,
      this.wordLang,
      this.wordTranslationId,
      theme
    );
  }

  /**
   * Get primary translation ID
   */
  getPrimaryTranslationId(): number {
    return this.translationIds[0];
  }

  /**
   * Get primary tafsir ID
   */
  getPrimaryTafsirId(): number | null {
    return this.tafsirIds[0] || null;
  }

  /**
   * Check if multiple translations are enabled
   */
  hasMultipleTranslations(): boolean {
    return this.translationIds.length > 1;
  }

  /**
   * Check if multiple tafsirs are enabled
   */
  hasMultipleTafsirs(): boolean {
    return this.tafsirIds.length > 1;
  }

  /**
   * Get reading preferences summary
   */
  getReadingPreferences(): {
    hasWordByWord: boolean;
    hasTajweed: boolean;
    isLargeText: boolean;
    primaryLanguage: string;
  } {
    return {
      hasWordByWord: this.showByWords,
      hasTajweed: this.tajweed,
      isLargeText: this.fontSize > 20,
      primaryLanguage: this.wordLang,
    };
  }

  /**
   * Validate settings completeness
   */
  isValid(): boolean {
    return (
      this.translationIds.length > 0 &&
      this.fontSize >= 10 &&
      this.fontSize <= 32 &&
      this.isValidArabicFont(this.arabicFont) &&
      this.isValidLanguage(this.wordLang) &&
      this.wordTranslationId > 0
    );
  }

  /**
   * Convert to storage format
   */
  toStorage(): SettingsStorageData {
    return {
      translationIds: this.translationIds,
      tafsirIds: this.tafsirIds,
      arabicFont: this.arabicFont,
      fontSize: this.fontSize,
      showByWords: this.showByWords,
      tajweed: this.tajweed,
      wordLang: this.wordLang,
      wordTranslationId: this.wordTranslationId,
      theme: this.theme,
    };
  }

  // Private validation methods
  private isValidArabicFont(font: string): boolean {
    const validFonts = [
      'uthmanic-hafs',
      'amiri',
      'lateef',
      'scheherazade-new',
      'noor-e-hira',
      'uthman-taha',
    ];
    return validFonts.includes(font);
  }

  private isValidLanguage(lang: string): boolean {
    const validLangs = ['en', 'ar', 'ur', 'bn', 'tr', 'fr', 'de'];
    return validLangs.includes(lang);
  }
}

export interface SettingsStorageData {
  translationIds: number[];
  tafsirIds: number[];
  arabicFont: string;
  fontSize: number;
  showByWords: boolean;
  tajweed: boolean;
  wordLang: string;
  wordTranslationId: number;
  theme: 'light' | 'dark' | 'system';
}
