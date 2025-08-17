/**
 * Metadata for a chapter (surah) of the Quran.
 */
export interface Chapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  revelation_place: string;
  verses_count: number;
  pages?: [number, number];
  /**
   * English translation of the chapter name.
   */
  translated_name?: {
    name: string;
  };
}
