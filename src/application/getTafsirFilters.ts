import { Tafsir } from '@/src/domain/entities/Tafsir';
import { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';
import { logger as Logger } from '@/src/infrastructure/monitoring/Logger';

import { getCachedResourcesWithFallback } from './getTafsirCache';

export async function getTafsirsByLanguage(
  repository: ITafsirRepository,
  language: string
): Promise<{
  tafsirs: Tafsir[];
  isFromCache: boolean;
  error?: string;
}> {
  try {
    const tafsirs = await repository.getResourcesByLanguage(language);
    return { tafsirs, isFromCache: false };
  } catch (error) {
    Logger.warn(
      `Failed to fetch tafsir resources for language ${language}:`,
      undefined,
      error as Error
    );
    const cachedResult = await getCachedResourcesWithFallback(repository);
    return {
      tafsirs: cachedResult.tafsirs.filter((t) => t.isInLanguage(language)),
      isFromCache: true,
      error: cachedResult.error,
    };
  }
}

export async function searchTafsirs(
  repository: ITafsirRepository,
  searchTerm: string
): Promise<Tafsir[]> {
  if (!searchTerm.trim()) {
    try {
      const tafsirs = await repository.getAllResources();
      if (tafsirs.length > 0) return tafsirs;
      return (await getCachedResourcesWithFallback(repository)).tafsirs;
    } catch (error) {
      Logger.warn('Failed to fetch fresh tafsir resources:', undefined, error as Error);
      return (await getCachedResourcesWithFallback(repository)).tafsirs;
    }
  }

  try {
    return await repository.search(searchTerm);
  } catch (error) {
    Logger.warn('Search failed, using cached data:', undefined, error as Error);
    const cached = await repository.getCachedResources();
    return cached.filter((t) => t.matchesSearch(searchTerm));
  }
}
