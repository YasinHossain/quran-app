import { IconBook, IconHash, IconFileText } from '@tabler/icons-react';
import { useState, useMemo, Dispatch, SetStateAction } from 'react';

import { useNavigationDatasets } from '@/app/shared/navigation/hooks/useNavigationDatasets';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';

import type { JuzSummary } from '@/app/shared/navigation/types';
import type { Surah } from '@/types';

interface QuranNavigationReturn {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  activeTab: 'surah' | 'juz' | 'page';
  setActiveTab: Dispatch<SetStateAction<'surah' | 'juz' | 'page'>>;
  tabs: { id: 'surah' | 'juz' | 'page'; label: string; icon: typeof IconBook }[];
  filteredSurahs: Surah[];
  filteredJuzs: JuzSummary[];
  filteredPages: number[];
}

export function useQuranNavigation(): QuranNavigationReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'page'>('surah');
  const { juzs, pages } = useNavigationDatasets();
  const { surahs } = useSurahNavigationData();

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
