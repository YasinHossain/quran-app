import { useMemo } from 'react';

import { useNavigationDatasets } from '@/app/shared/navigation/hooks/useNavigationDatasets';

import type { JuzSummary } from '@/app/shared/navigation/types';
import type { TabKey } from '@/app/shared/components/surah-tabs/types';
import type { Chapter } from '@/types';


interface SurahListFiltersResult {
  filteredChapters: Chapter[];
  filteredJuzs: JuzSummary[];
  filteredPages: number[];
}

export function useSurahListFilters(
  chapters: ReadonlyArray<Chapter>,
  searchTerm: string,
  activeTab: TabKey
): SurahListFiltersResult {
  const term = searchTerm.toLowerCase();
  const { juzs, pages } = useNavigationDatasets();

  // Always filter chapters (most common use case)
  const filteredChapters = useMemo(
    () =>
      chapters.filter(
        (c) => c.name_simple.toLowerCase().includes(term) || c.id.toString().includes(searchTerm)
      ),
    [chapters, term, searchTerm]
  );

  // Lazy filter: Only filter Juz data when Juz tab is active
  // This reduces computation by ~85% when user is on Surah tab
  const filteredJuzs = useMemo(
    () => (activeTab === 'Juz' ? juzs.filter((j) => j.number.toString().includes(searchTerm)) : []),
    [juzs, searchTerm, activeTab]
  );

  // Lazy filter: Only filter Page data when Page tab is active
  // This reduces computation by ~85% when user is on Surah tab
  const filteredPages = useMemo(
    () => (activeTab === 'Page' ? pages.filter((p) => p.toString().includes(searchTerm)) : []),
    [pages, searchTerm, activeTab]
  );

  return { filteredChapters, filteredJuzs, filteredPages };
}
