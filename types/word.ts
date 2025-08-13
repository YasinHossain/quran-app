import type { LanguageCode } from '@/lib/text/languageCodes';

/**
 * A Quranic word with optionally localized text in multiple languages.
 */
export interface Word extends Partial<Record<Exclude<LanguageCode, 'id'>, string>> {
  id: number;
  uthmani: string;
}
