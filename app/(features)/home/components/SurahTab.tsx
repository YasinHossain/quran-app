'use client';
import React, { useEffect, useMemo, useState } from 'react';

import { getSurahList } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { SurahEmptyState } from './SurahEmptyState';
import { SurahGrid } from './SurahGrid';
import { SurahLoadingGrid } from './SurahLoadingGrid';

import type { Surah } from '@/types';

interface SurahTabProps {
  searchQuery: string;
}

export function SurahTab({ searchQuery }: SurahTabProps) {
  const [allSurahs, setAllSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    getSurahList()
      .then(setAllSurahs)
      .catch((err) => logger.error(err as Error));
  }, []);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return allSurahs;
    return allSurahs.filter(
      (surah) =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    );
  }, [searchQuery, allSurahs]);

  if (allSurahs.length === 0) {
    return <SurahLoadingGrid />;
  }

  if (filteredSurahs.length === 0) {
    return <SurahEmptyState />;
  }

  return <SurahGrid surahs={filteredSurahs} />;
}
