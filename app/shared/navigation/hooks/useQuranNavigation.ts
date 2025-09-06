import { IconBook, IconHash, IconFileText } from '@tabler/icons-react';
import { useState, useEffect, useMemo } from 'react';

import juzData from '@/data/juz.json';
import { getSurahList } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { Surah } from '@/types';

export interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

export function useQuranNavigation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'page'>('surah');
  const [surahs, setSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    getSurahList()
      .then(setSurahs)
      .catch((err) => logger.error(err as Error));
  }, []);

  const juzs = useMemo(() => juzData as JuzSummary[], []);
  const pages = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);
  const tabs = useMemo(
    () => [
      { id: 'surah', label: 'Surah', icon: IconBook },
      { id: 'juz', label: 'Juz', icon: IconHash },
      { id: 'page', label: 'Page', icon: IconFileText },
    ],
    []
  );

  const term = searchTerm.toLowerCase();
  const filteredSurahs = useMemo(
    () =>
      surahs.filter(
        (s) => s.name.toLowerCase().includes(term) || s.number.toString().includes(searchTerm)
      ),
    [surahs, term, searchTerm]
  );
  const filteredJuzs = useMemo(
    () =>
      juzs.filter(
        (j) => j.name.toLowerCase().includes(term) || j.number.toString().includes(searchTerm)
      ),
    [juzs, term, searchTerm]
  );
  const filteredPages = useMemo(
    () => pages.filter((p) => p.toString().includes(searchTerm)),
    [pages, searchTerm]
  );

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    tabs,
    filteredSurahs,
    filteredJuzs,
    filteredPages,
  };
}
