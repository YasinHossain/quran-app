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
  /** False when the surah does not open with the Basmala (At-Tawbah; Al-Fatihah's is verse 1). */
  bismillah_pre?: boolean;
  /**
   * English translation of the chapter name.
   */
  translated_name?: {
    name: string;
  };
}
