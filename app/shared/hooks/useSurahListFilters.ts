import { useMemo } from 'react';

import juzData from '@/data/juz.json';
import type { Chapter } from '@/types';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

export function useSurahListFilters(chapters: Chapter[], searchTerm: string) {
  const term = searchTerm.toLowerCase();

  const juzs = useMemo(() => juzData as JuzSummary[], []);
  const pages = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);

  const filteredChapters = useMemo(
    () =>
      chapters.filter(
        (c) =>
          c.name_simple.toLowerCase().includes(term) ||
          c.id.toString().includes(searchTerm)
      ),
    [chapters, term, searchTerm]
  );

  const filteredJuzs = useMemo(
    () => juzs.filter((j) => j.number.toString().includes(searchTerm)),
    [juzs, searchTerm]
  );

  const filteredPages = useMemo(
    () => pages.filter((p) => p.toString().includes(searchTerm)),
    [pages, searchTerm]
  );

  return { filteredChapters, filteredJuzs, filteredPages };
}

