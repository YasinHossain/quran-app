/**
 * Domain Entity: Settings
 *
 * Represents application settings with validation and business logic.
 */

import { ARABIC_FONTS } from '../constants/fonts';
import { Settings as UISettings } from '../../../types/settings';

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
    public readonly arabicFontSize: number,
    public readonly translationFontSize: number,
    public readonly tafsirFontSize: number,
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
      24, // Default Arabic font size
      16, // Default translation font size
      16, // Default tafsir font size
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
    // Handle backward compatibility - if old fontSize exists, use it for both
    const defaultArabicSize = data.arabicFontSize ?? data.fontSize ?? 24;
    const defaultTranslationSize =
      data.translationFontSize ?? Math.round((data.fontSize ?? 16) * 0.67) ?? 16;
    const defaultTafsirSize =
      data.tafsirFontSize ??
      data.translationFontSize ??
      Math.round((data.fontSize ?? 16) * 0.67) ??
      16;

    return new Settings(
      data.translationIds || [20],
      data.tafsirIds || [169],
      data.arabicFont || ARABIC_FONTS[0].value,
      defaultArabicSize,
      defaultTranslationSize,
      defaultTafsirSize,
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
      this.arabicFontSize,
      this.translationFontSize,
      this.tafsirFontSize,
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
      this.arabicFontSize,
      this.translationFontSize,
      this.tafsirFontSize,
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
      this.arabicFontSize,
      this.translationFontSize,
      this.tafsirFontSize,
      this.showByWords,
      this.tajweed,
      this.wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Update Arabic font size (returns new instance - immutable)
   */
  withArabicFontSize(arabicFontSize: number): Settings {
    if (arabicFontSize < 16 || arabicFontSize > 48) {
      throw new Error('Arabic font size must be between 16 and 48');
    }

    return new Settings(
      this.translationIds,
      this.tafsirIds,
      this.arabicFont,
      arabicFontSize,
      this.translationFontSize,
      this.tafsirFontSize,
      this.showByWords,
      this.tajweed,
      this.wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Update translation font size (returns new instance - immutable)
   */
  withTranslationFontSize(translationFontSize: number): Settings {
    if (translationFontSize < 12 || translationFontSize > 28) {
      throw new Error('Translation font size must be between 12 and 28');
    }

    return new Settings(
      this.translationIds,
      this.tafsirIds,
      this.arabicFont,
      this.arabicFontSize,
      translationFontSize,
      this.tafsirFontSize,
      this.showByWords,
      this.tajweed,
      this.wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Update tafsir font size (returns new instance - immutable)
   */
  withTafsirFontSize(tafsirFontSize: number): Settings {
    if (tafsirFontSize < 12 || tafsirFontSize > 28) {
      throw new Error('Tafsir font size must be between 12 and 28');
    }

    return new Settings(
      this.translationIds,
      this.tafsirIds,
      this.arabicFont,
      this.arabicFontSize,
      this.translationFontSize,
      tafsirFontSize,
      this.showByWords,
      this.tajweed,
      this.wordLang,
      this.wordTranslationId,
      this.theme
    );
  }

  /**
   * Update font size (returns new instance - immutable) - deprecated, kept for backward compatibility
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
      Math.round(fontSize * 0.67),
      Math.round(fontSize * 0.67),
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
      this.arabicFontSize,
      this.translationFontSize,
      this.tafsirFontSize,
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
      this.arabicFontSize,
      this.translationFontSize,
      this.tafsirFontSize,
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
      this.arabicFontSize,
      this.translationFontSize,
      this.tafsirFontSize,
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
      this.arabicFontSize,
      this.translationFontSize,
      this.tafsirFontSize,
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
      this.arabicFontSize,
      this.translationFontSize,
      this.tafsirFontSize,
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
      isLargeText: this.arabicFontSize > 28,
      primaryLanguage: this.wordLang,
    };
  }

  /**
   * Validate settings completeness
   */
  isValid(): boolean {
    return (
      this.translationIds.length > 0 &&
      this.arabicFontSize >= 16 &&
      this.arabicFontSize <= 48 &&
      this.translationFontSize >= 12 &&
      this.translationFontSize <= 28 &&
      this.tafsirFontSize >= 12 &&
      this.tafsirFontSize <= 28 &&
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
      arabicFontSize: this.arabicFontSize,
      translationFontSize: this.translationFontSize,
      tafsirFontSize: this.tafsirFontSize,
      showByWords: this.showByWords,
      tajweed: this.tajweed,
      wordLang: this.wordLang,
      wordTranslationId: this.wordTranslationId,
      theme: this.theme,
    };
  }

  /**
   * Convert to UI format (for React components)
   */
  toUI(): UISettings {
    return {
      translationId: this.translationIds[0] || 20,
      translationIds: this.translationIds,
      tafsirIds: this.tafsirIds,
      arabicFontSize: this.arabicFontSize,
      translationFontSize: this.translationFontSize,
      tafsirFontSize: this.tafsirFontSize,
      arabicFontFace: this.arabicFont,
      wordLang: this.wordLang,
      wordTranslationId: this.wordTranslationId,
      showByWords: this.showByWords,
      tajweed: this.tajweed,
    };
  }

  // Private validation methods
  private isValidArabicFont(font: string): boolean {
    const validFonts = ARABIC_FONTS.map((f) => f.value);
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
  fontSize?: number; // For backward compatibility
  arabicFontSize?: number;
  translationFontSize?: number;
  tafsirFontSize?: number;
  showByWords: boolean;
  tajweed: boolean;
  wordLang: string;
  wordTranslationId: number;
  theme: 'light' | 'dark' | 'system';
}
