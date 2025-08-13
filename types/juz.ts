/**
 * Represents metadata for a Juz, one of thirty parts of the Quran.
 */
export interface Juz {
  id: number;
  juz_number: number;
  verse_mapping: Record<string, string>;
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
}
