import {
  getCachedResourcesWithFallback,
  getTafsirByIdWithCache,
} from '@/src/application/getTafsirCache';
import { getTafsirsByLanguage, searchTafsirs } from '@/src/application/getTafsirFilters';
import { Tafsir } from '@/src/domain/entities/Tafsir';
import { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';
import { logger as Logger } from '@/src/infrastructure/monitoring/Logger';

/**
 * Use Case: Get Tafsir Resources
 *
 * Orchestrates retrieval and management of tafsir resources.
 * Delegates caching and filtering to helper modules.
 */
export class GetTafsirResourcesUseCase {
  constructor(private readonly tafsirRepository: ITafsirRepository) {}

  async execute(): Promise<{
    tafsirs: Tafsir[];
    isFromCache: boolean;
    error?: string;
  }> {
    try {
      const tafsirs = await this.tafsirRepository.getAllResources();
      if (tafsirs.length > 0) {
        return { tafsirs, isFromCache: false };
      }
      return getCachedResourcesWithFallback(this.tafsirRepository);
    } catch (error) {
      Logger.warn('Failed to fetch fresh tafsir resources:', undefined, error as Error);
      return getCachedResourcesWithFallback(this.tafsirRepository);
    }
  }

  async executeByLanguage(language: string): Promise<{
    tafsirs: Tafsir[];
    isFromCache: boolean;
    error?: string;
  }> {
    return getTafsirsByLanguage(this.tafsirRepository, language);
  }

  async search(searchTerm: string): Promise<Tafsir[]> {
    return searchTafsirs(this.tafsirRepository, searchTerm);
  }

  async getById(id: number): Promise<Tafsir | null> {
    return getTafsirByIdWithCache(this.tafsirRepository, id);
  }

  async getTafsirContent(verseKey: string, tafsirId: number): Promise<string> {
    return this.tafsirRepository.getTafsirByVerse(verseKey, tafsirId);
  }
}
