import { useEffect, useMemo, useState } from 'react';

import { getSurahList } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { Surah } from '@/types';

type UseSurahSearchResult = {
  filteredSurahs: Surah[];
  isLoading: boolean;
  isEmpty: boolean;
};

export function useSurahSearch(searchQuery: string): UseSurahSearchResult {
  const [surahs, setSurahs] = useState<Surah[]>([]);

  useEffect((): void => {
    void getSurahList()
      .then((fetchedSurahs: Surah[]): void => {
        setSurahs(fetchedSurahs);
      })
      .catch((err: unknown): void => {
        logger.error(err as Error);
      });
  }, []);

  const filteredSurahs = useMemo<Surah[]>((): Surah[] => {
    if (!searchQuery) return surahs;
    return surahs.filter(
      (surah: Surah): boolean =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    );
  }, [searchQuery, surahs]);

  const isLoading = surahs.length === 0;
  const isEmpty = !isLoading && filteredSurahs.length === 0;

  return { filteredSurahs, isLoading, isEmpty } as const;
}
