import { Tafsir } from '@/src/domain/entities/Tafsir';

/**
 * Repository interface for Tafsir operations
 *
 * Defines the contract for accessing and managing Tafsir resources.
 * This interface is implemented by the infrastructure layer.
 */
export interface ITafsirRepository {
  /**
   * Get all available tafsir resources
   * @returns Promise resolving to array of all tafsir resources
   */
  getAllResources(): Promise<Tafsir[]>;

  /**
   * Get tafsir resources for a specific language
   * @param language - Language code (e.g., 'en', 'ar', 'bn')
   * @returns Promise resolving to array of tafsir resources in the specified language
   */
  getResourcesByLanguage(language: string): Promise<Tafsir[]>;

  /**
   * Get a specific tafsir by ID
   * @param id - Tafsir resource ID
   * @returns Promise resolving to tafsir resource or null if not found
   */
  getById(id: number): Promise<Tafsir | null>;

  /**
   * Get tafsir content for a specific verse
   * @param verseKey - Verse identifier (e.g., "1:1")
   * @param tafsirId - Tafsir resource ID
   * @returns Promise resolving to HTML content of the tafsir
   */
  getTafsirByVerse(verseKey: string, tafsirId: number): Promise<string>;

  /**
   * Search tafsir resources by name or language
   * @param searchTerm - Search term to match against
   * @returns Promise resolving to array of matching tafsir resources
   */
  search(searchTerm: string): Promise<Tafsir[]>;

  /**
   * Cache tafsir resources for offline access
   * @param tafsirs - Array of tafsir resources to cache
   */
  cacheResources(tafsirs: Tafsir[]): Promise<void>;

  /**
   * Get cached tafsir resources
   * @returns Promise resolving to array of cached tafsir resources
   */
  getCachedResources(): Promise<Tafsir[]>;
}
