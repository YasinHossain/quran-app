import {
  getCachedResourcesWithFallback,
  getTafsirByIdWithCache,
} from '@/src/application/getTafsirCache';
import { getTafsirsByLanguage, searchTafsirs } from '@/src/application/getTafsirFilters';
import { Tafsir } from '@/src/domain/entities/Tafsir';
import { ILogger } from '@/src/domain/interfaces/ILogger';
import { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';

/**
 * Use Case: Get Tafsir Resources
 *
 * Orchestrates retrieval and management of tafsir resources.
 * Delegates caching and filtering to helper modules.
 */
export class GetTafsirResourcesUseCase {
  constructor(
    private readonly tafsirRepository: ITafsirRepository,
    private readonly logger?: ILogger
  ) {}

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
      this.logger?.warn('Failed to fetch fresh tafsir resources:', undefined, error as Error);
      return getCachedResourcesWithFallback(this.tafsirRepository);
    }
  }

  async executeByLanguage(language: string): Promise<{
    tafsirs: Tafsir[];
    isFromCache: boolean;
    error?: string;
  }> {
    return getTafsirsByLanguage(this.tafsirRepository, language, this.logger);
  }

  async search(searchTerm: string): Promise<Tafsir[]> {
    return searchTafsirs(this.tafsirRepository, searchTerm, this.logger);
  }

  async getById(id: number): Promise<Tafsir | null> {
    return getTafsirByIdWithCache(this.tafsirRepository, id, this.logger);
  }

  async getTafsirContent(verseKey: string, tafsirId: number): Promise<string> {
    return this.tafsirRepository.getTafsirByVerse(verseKey, tafsirId);
  }
}
