import {
  InvalidTafsirRequestError,
  TafsirContentLoadError,
} from '../../domain/errors/DomainErrors';
import { ITafsirRepository } from '../../domain/repositories/ITafsirRepository';
import { logger as Logger } from '../../infrastructure/monitoring/Logger';

/**
 * Use Case: Get Tafsir Content for a Verse
 *
 * Handles retrieving tafsir content for specific verses with caching and fallback.
 */
export class GetTafsirContentUseCase {
  constructor(private readonly tafsirRepository: ITafsirRepository) {}

  /**
   * Get tafsir content for a specific verse
   *
   * @param verseKey - Verse identifier (e.g., "1:1")
   * @param tafsirId - Tafsir resource ID
   * @returns Promise resolving to HTML content
   */
  async execute(verseKey: string, tafsirId: number): Promise<string> {
    if (!verseKey || !tafsirId) {
      throw new InvalidTafsirRequestError();
    }

    try {
      const content = await this.tafsirRepository.getTafsirByVerse(verseKey, tafsirId);

      if (!content || content.trim() === '') {
        return 'No tafsir content available for this verse.';
      }

      return content;
    } catch (error) {
      Logger.error('Failed to get tafsir content:', undefined, error as Error);
      throw new TafsirContentLoadError();
    }
  }

  /**
   * Get tafsir content for multiple tafsir sources
   *
   * @param verseKey - Verse identifier
   * @param tafsirIds - Array of tafsir resource IDs
   * @returns Promise resolving to map of tafsir ID to content
   */
  async executeMultiple(verseKey: string, tafsirIds: number[]): Promise<Map<number, string>> {
    const results = new Map<number, string>();

    const promises = tafsirIds.map(async (tafsirId) => {
      try {
        const content = await this.execute(verseKey, tafsirId);
        results.set(tafsirId, content);
      } catch (error) {
        Logger.warn(`Failed to get tafsir content for ID ${tafsirId}:`, undefined, error as Error);
        results.set(tafsirId, 'Failed to load tafsir content.');
      }
    });

    await Promise.allSettled(promises);
    return results;
  }
}
