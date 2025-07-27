export * from './verse';
export * from './chapter';
export * from './translation';
export * from './settings';
export * from './surah';
export * from './word';

export type { TafsirResource } from '../lib/api';

export interface Juz {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
}
