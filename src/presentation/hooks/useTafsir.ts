import { useState, useEffect, useMemo, useCallback } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

import { GetTafsirResourcesUseCase } from '../../application/use-cases/GetTafsirResources';
import { Tafsir } from '../../domain/entities/Tafsir';
import { container } from '../../infrastructure/di/container';

interface UseTafsirResult {
  tafsirs: Tafsir[];
  loading: boolean;
  error: string | null;
  isFromCache: boolean;
  searchTafsirs: (searchTerm: string) => Promise<Tafsir[]>;
  getTafsirById: (id: number) => Promise<Tafsir | null>;
  getTafsirContent: (verseKey: string, tafsirId: number) => Promise<string>;
  refresh: () => Promise<void>;
}

/**
 * Clean Architecture hook for Tafsir operations
 *
 * This hook follows the clean architecture pattern:
 * - Uses dependency injection to get repository
 * - Delegates business logic to use cases
 * - Only handles UI state and presentation concerns
 */
export const useTafsir = (): UseTafsirResult => {
  const [tafsirs, setTafsirs] = useState<Tafsir[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  // Get use case instance through DI container
  const useCase = useMemo(() => {
    const repository = container.getTafsirRepository();
    return new GetTafsirResourcesUseCase(repository);
  }, []);

  // Load tafsir resources
  const loadTafsirs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await useCase.execute();

      setTafsirs(result.tafsirs);
      setIsFromCache(result.isFromCache);

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load tafsir resources. Please try again.');
      logger.error('Error loading tafsirs', undefined, err as Error);
    } finally {
      setLoading(false);
    }
  }, [useCase]);

  // Search tafsirs
  const searchTafsirs = useCallback(
    async (searchTerm: string): Promise<Tafsir[]> => {
      try {
        return await useCase.search(searchTerm);
      } catch (err) {
        logger.error('Error searching tafsirs', undefined, err as Error);
        return [];
      }
    },
    [useCase]
  );

  // Get tafsir by ID
  const getTafsirById = useCallback(
    async (id: number): Promise<Tafsir | null> => {
      try {
        return await useCase.getById(id);
      } catch (err) {
        logger.error('Error getting tafsir by ID', undefined, err as Error);
        return null;
      }
    },
    [useCase]
  );

  // Get tafsir content for verse
  const getTafsirContent = useCallback(
    async (verseKey: string, tafsirId: number): Promise<string> => {
      try {
        return await useCase.getTafsirContent(verseKey, tafsirId);
      } catch (err) {
        logger.error('Error getting tafsir content', undefined, err as Error);
        throw err;
      }
    },
    [useCase]
  );

  // Refresh data
  const refresh = useCallback(async () => {
    await loadTafsirs();
  }, [loadTafsirs]);

  // Load tafsirs on mount
  useEffect(() => {
    loadTafsirs();
  }, [loadTafsirs]);

  return useMemo(
    () => ({
      tafsirs,
      loading,
      error,
      isFromCache,
      searchTafsirs,
      getTafsirById,
      getTafsirContent,
      refresh,
    }),
    [tafsirs, loading, error, isFromCache, searchTafsirs, getTafsirById, getTafsirContent, refresh]
  );
};
