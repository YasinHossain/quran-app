import { useMemo } from 'react';

import { useNavigationDatasets } from '@/app/shared/navigation/hooks/useNavigationDatasets';

import type { JuzSummary } from '@/app/shared/navigation/types';
import type { Chapter } from '@/types';

interface SurahListFiltersResult {
  filteredChapters: Chapter[];
  filteredJuzs: JuzSummary[];
  filteredPages: number[];
}

export function useSurahListFilters(
  chapters: ReadonlyArray<Chapter>,
  searchTerm: string
): SurahListFiltersResult {
  const term = searchTerm.toLowerCase();
  const { juzs, pages } = useNavigationDatasets();

  const filteredChapters = useMemo(
    () =>
      chapters.filter(
        (c) => c.name_simple.toLowerCase().includes(term) || c.id.toString().includes(searchTerm)
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
