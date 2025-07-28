import type { LanguageCode } from '@/lib/languageCodes';

export interface Word extends Partial<Record<Exclude<LanguageCode, 'id'>, string>> {
  id: number;
  uthmani: string;
}
