import { useEffect, useMemo, useCallback } from 'react';

import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';
import { Tafsir } from '@/src/domain/entities/Tafsir';
import { container } from '@/src/infrastructure/di/Container';

import { useTafsirById } from './useTafsirById';
import { useTafsirContent } from './useTafsirContent';
import { useTafsirLoader } from './useTafsirLoader';
import { useTafsirSearch } from './useTafsirSearch';

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

export const useTafsir = (): UseTafsirResult => {
  const useCase = useMemo(() => {
    const repository = container.getTafsirRepository();
    return new GetTafsirResourcesUseCase(repository);
  }, []);

  const { tafsirs, loading, error, isFromCache, loadTafsirs } = useTafsirLoader(useCase);
  const searchTafsirs = useTafsirSearch(useCase);
  const getTafsirById = useTafsirById(useCase);
  const getTafsirContent = useTafsirContent(useCase);

  const refresh = useCallback(() => loadTafsirs(), [loadTafsirs]);

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
