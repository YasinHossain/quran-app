/**
 * User preferences controlling fonts, translations and reading options.
 */
export interface Settings {
  translationId: number;
  translationIds: number[];
  tafsirIds: number[];
  arabicFontSize: number;
  translationFontSize: number;
  tafsirFontSize: number;
  arabicFontFace: string;
  wordLang: string;
  wordTranslationId: number;
  showByWords: boolean;
  tajweed: boolean;
  mushafId?: string;
}
