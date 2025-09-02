import { useState, useEffect, useMemo } from 'react';
import { container } from '../../infrastructure/di/Container';
import { GetTafsirResourcesUseCase } from '../../application/use-cases/GetTafsirResources';
import { Tafsir } from '../../domain/entities/Tafsir';

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
  const loadTafsirs = async () => {
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
      console.error('Error loading tafsirs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search tafsirs
  const searchTafsirs = async (searchTerm: string): Promise<Tafsir[]> => {
    try {
      return await useCase.search(searchTerm);
    } catch (err) {
      console.error('Error searching tafsirs:', err);
      return [];
    }
  };

  // Get tafsir by ID
  const getTafsirById = async (id: number): Promise<Tafsir | null> => {
    try {
      return await useCase.getById(id);
    } catch (err) {
      console.error('Error getting tafsir by ID:', err);
      return null;
    }
  };

  // Get tafsir content for verse
  const getTafsirContent = async (verseKey: string, tafsirId: number): Promise<string> => {
    try {
      return await useCase.getTafsirContent(verseKey, tafsirId);
    } catch (err) {
      console.error('Error getting tafsir content:', err);
      throw err;
    }
  };

  // Refresh data
  const refresh = async () => {
    await loadTafsirs();
  };

  // Load tafsirs on mount
  useEffect(() => {
    loadTafsirs();
  }, []);

  return {
    tafsirs,
    loading,
    error,
    isFromCache,
    searchTafsirs,
    getTafsirById,
    getTafsirContent,
    refresh,
  };
};
