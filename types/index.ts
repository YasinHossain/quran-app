export * from './verse';
export * from './chapter';
export * from './translation';
export * from './tafsir';
export * from './settings';
export * from './surah';
export * from './word';
export * from './juz';
export type { Bookmark, BookmarkWithVerse, Folder } from './bookmark';
export * from './components';

/**
 * Mapping and metadata for a Juz (section) of the Quran.
 */
export interface Juz {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
}
