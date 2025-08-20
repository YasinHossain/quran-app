/**
 * Information about a translation resource available to the app.
 */
export interface TranslationResource {
  /**
   * Unique identifier of the translation resource.
   */
  id: number;
  /**
   * Display name of the translation.
   */
  name: string;
  /**
   * Human-readable language of the translation.
   */
  lang: string;
}
