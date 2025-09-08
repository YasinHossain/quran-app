import { useEffect, useMemo, useState } from 'react';

import { getSurahList } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { Surah } from '@/types';

export function useSurahSearch(searchQuery: string): {
  filteredSurahs: Surah[];
  isLoading: boolean;
  isEmpty: boolean;
} {
  const [surahs, setSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    getSurahList()
      .then(setSurahs)
      .catch((err) => logger.error(err as Error));
  }, []);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return surahs;
    return surahs.filter(
      (surah) =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    );
  }, [searchQuery, surahs]);

  const isLoading = surahs.length === 0;
  const isEmpty = !isLoading && filteredSurahs.length === 0;

  return { filteredSurahs, isLoading, isEmpty } as const;
}
