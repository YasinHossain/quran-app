import { Tafsir } from '../../domain/entities/Tafsir';
import { ITafsirRepository } from '../../domain/repositories/ITafsirRepository';
import { logger as Logger } from '../../infrastructure/monitoring/Logger';

/**
 * Use Case: Get Tafsir Resources
 *
 * Handles the business logic for retrieving and managing tafsir resources.
 * Implements caching strategy and error recovery.
 */
export class GetTafsirResourcesUseCase {
  constructor(private readonly tafsirRepository: ITafsirRepository) {}

  /**
   * Execute the use case to get all tafsir resources
   *
   * Strategy:
   * 1. Try to get fresh data from API
   * 2. If successful, cache and return
   * 3. If failed, try cached data
   * 4. If no cached data, throw error
   */
  async execute(): Promise<{
    tafsirs: Tafsir[];
    isFromCache: boolean;
    error?: string;
  }> {
    try {
      // Try to get fresh data
      const tafsirs = await this.tafsirRepository.getAllResources();

      if (tafsirs.length > 0) {
        return {
          tafsirs,
          isFromCache: false,
        };
      }

      // If no data from API, try cache
      return await this.getCachedResourcesWithFallback();
    } catch (error) {
      Logger.warn('Failed to fetch fresh tafsir resources:', undefined, error as Error);

      // Try cached data as fallback
      return await this.getCachedResourcesWithFallback();
    }
  }

  /**
   * Get tafsir resources by language with caching
   */
  async executeByLanguage(language: string): Promise<{
    tafsirs: Tafsir[];
    isFromCache: boolean;
    error?: string;
  }> {
    try {
      const tafsirs = await this.tafsirRepository.getResourcesByLanguage(language);

      return {
        tafsirs,
        isFromCache: false,
      };
    } catch (error) {
      Logger.warn(
        `Failed to fetch tafsir resources for language ${language}:`,
        undefined,
        error as Error
      );

      // For language-specific requests, filter cached data
      const cachedResult = await this.getCachedResourcesWithFallback();
      const filteredTafsirs = cachedResult.tafsirs.filter((t) => t.isInLanguage(language));

      return {
        tafsirs: filteredTafsirs,
        isFromCache: true,
        error: cachedResult.error,
      };
    }
  }

  /**
   * Search tafsir resources
   */
  async search(searchTerm: string): Promise<Tafsir[]> {
    if (!searchTerm.trim()) {
      const result = await this.execute();
      return result.tafsirs;
    }

    try {
      return await this.tafsirRepository.search(searchTerm);
    } catch (error) {
      Logger.warn('Search failed, using cached data:', undefined, error as Error);
      const cached = await this.tafsirRepository.getCachedResources();
      return cached.filter((t) => t.matchesSearch(searchTerm));
    }
  }

  /**
   * Get tafsir by ID
   */
  async getById(id: number): Promise<Tafsir | null> {
    try {
      return await this.tafsirRepository.getById(id);
    } catch (error) {
      Logger.warn('Failed to get tafsir by ID, trying cache:', undefined, error as Error);
      const cached = await this.tafsirRepository.getCachedResources();
      return cached.find((t) => t.id === id) || null;
    }
  }

  /**
   * Get tafsir content for a verse
   */
  async getTafsirContent(verseKey: string, tafsirId: number): Promise<string> {
    return this.tafsirRepository.getTafsirByVerse(verseKey, tafsirId);
  }

  /**
   * Private helper to get cached resources with proper error handling
   */
  private async getCachedResourcesWithFallback(): Promise<{
    tafsirs: Tafsir[];
    isFromCache: boolean;
    error?: string;
  }> {
    try {
      const cachedTafsirs = await this.tafsirRepository.getCachedResources();

      if (cachedTafsirs.length > 0) {
        return {
          tafsirs: cachedTafsirs,
          isFromCache: true,
        };
      }

      return {
        tafsirs: [],
        isFromCache: false,
        error: 'No tafsir resources available. Please check your internet connection.',
      };
    } catch (error) {
      return {
        tafsirs: [],
        isFromCache: false,
        error: 'Failed to load tafsir resources. Please try again.',
      };
    }
  }
}
