import { useState, useCallback } from 'react';

import { GetTafsirResourcesUseCase } from '@/src/application/use-cases/GetTafsirResources';
import { Tafsir } from '@/src/domain/entities/Tafsir';
import { logger } from '@/src/infrastructure/monitoring/Logger';

interface LoaderResult {
  tafsirs: Tafsir[];
  loading: boolean;
  error: string | null;
  isFromCache: boolean;
  loadTafsirs: () => Promise<void>;
}

export const useTafsirLoader = (useCase: GetTafsirResourcesUseCase): LoaderResult => {
  const [tafsirs, setTafsirs] = useState<Tafsir[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const loadTafsirs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await useCase.execute();
      setTafsirs(result.tafsirs);
      setIsFromCache(result.isFromCache);
      if (result.error) setError(result.error);
    } catch (err) {
      setError('Failed to load tafsir resources. Please try again.');
      logger.error('Error loading tafsirs', undefined, err as Error);
    } finally {
      setLoading(false);
    }
  }, [useCase]);

  return { tafsirs, loading, error, isFromCache, loadTafsirs };
};
