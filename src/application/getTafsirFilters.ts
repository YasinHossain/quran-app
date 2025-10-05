import { Tafsir } from '@/src/domain/entities/Tafsir';
import { ILogger } from '@/src/domain/interfaces/ILogger';
import { ITafsirRepository } from '@/src/domain/repositories/ITafsirRepository';

import { getCachedResourcesWithFallback } from './getTafsirCache';

export async function getTafsirsByLanguage(
  repository: ITafsirRepository,
  language: string,
  logger?: ILogger
): Promise<{
  tafsirs: Tafsir[];
  isFromCache: boolean;
  error?: string;
}> {
  try {
    const tafsirs = await repository.getResourcesByLanguage(language);
    return { tafsirs, isFromCache: false };
  } catch (error) {
    logger?.warn(
      `Failed to fetch tafsir resources for language ${language}:`,
      undefined,
      error as Error
    );
    const cachedResult = await getCachedResourcesWithFallback(repository);
    return {
      tafsirs: cachedResult.tafsirs.filter((t) => t.isInLanguage(language)),
      isFromCache: true,
      ...(cachedResult.error ? { error: cachedResult.error } : {}),
    };
  }
}

export async function searchTafsirs(
  repository: ITafsirRepository,
  searchTerm: string,
  logger?: ILogger
): Promise<Tafsir[]> {
  if (!searchTerm.trim()) {
    try {
      const tafsirs = await repository.getAllResources();
      if (tafsirs.length > 0) return tafsirs;
      return (await getCachedResourcesWithFallback(repository)).tafsirs;
    } catch (error) {
      logger?.warn('Failed to fetch fresh tafsir resources:', undefined, error as Error);
      return (await getCachedResourcesWithFallback(repository)).tafsirs;
    }
  }

  try {
    return await repository.search(searchTerm);
  } catch (error) {
    logger?.warn('Search failed, using cached data:', undefined, error as Error);
    const cached = await repository.getCachedResources();
    return cached.filter((t) => t.matchesSearch(searchTerm));
  }
}
