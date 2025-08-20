/**
 * Information about a tafsir resource available to the app.
 */
export interface TafsirResource {
  /**
   * Unique identifier of the tafsir resource.
   */
  id: number;
  /**
   * Display name of the tafsir.
   */
  name: string;
  /**
   * Human-readable language of the tafsir.
   */
  lang: string;
}
