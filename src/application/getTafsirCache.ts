import { Tafsir } from '../domain/entities/Tafsir';
import { ITafsirRepository } from '../domain/repositories/ITafsirRepository';
import { logger as Logger } from '../infrastructure/monitoring/Logger';

export async function getCachedResourcesWithFallback(repository: ITafsirRepository): Promise<{
  tafsirs: Tafsir[];
  isFromCache: boolean;
  error?: string;
}> {
  try {
    const cachedTafsirs = await repository.getCachedResources();

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
  } catch {
    return {
      tafsirs: [],
      isFromCache: false,
      error: 'Failed to load tafsir resources. Please try again.',
    };
  }
}

export async function getTafsirByIdWithCache(
  repository: ITafsirRepository,
  id: number
): Promise<Tafsir | null> {
  try {
    return await repository.getById(id);
  } catch (error) {
    Logger.warn('Failed to get tafsir by ID, trying cache:', undefined, error as Error);
    const cached = await repository.getCachedResources();
    return cached.find((t) => t.id === id) || null;
  }
}
