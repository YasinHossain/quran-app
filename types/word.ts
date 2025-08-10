import type { LanguageCode } from '@/lib/text/languageCodes';

export interface Word extends Partial<Record<Exclude<LanguageCode, 'id'>, string>> {
  id: number;
  uthmani: string;
}
