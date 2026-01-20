import type { LanguageCode } from '@/lib/text/languageCodes';

/**
 * A Quranic word with optionally localized text in multiple languages.
 */
export interface Word extends Partial<Record<Exclude<LanguageCode, 'id'>, string>> {
  id: number;
  /** IndoPak script text for the word (if provided by the API). */
  indopak?: string;
  uthmani: string;
  char_type_name?: string;
  /** QCF V2/V4 glyph code for Tajweed rendering */
  codeV2?: string;
  /** Page number for V4 Tajweed font loading */
  pageNumber?: number;
  /** 1-indexed position of the word within the verse (for audio word sync) */
  position?: number;
}
