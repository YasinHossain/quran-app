import { useState } from 'react';

import { useSurahTabConfig } from './useSurahTabConfig';
import { useSurahTabParams } from './useSurahTabParams';

import type { Chapter } from '@/types';

import { useSelectionSync } from '@/app/shared/components/surah-sidebar/hooks/useSelectionSync';
import { useSidebarScroll } from '@/app/shared/components/surah-sidebar/useSidebarScroll';

interface UseSurahTabsParams {
  chapters: Chapter[];
  filteredChapters: Chapter[];
  filteredJuzs: { number: number; name: string; surahRange: string }[];
  filteredPages: number[];
}

export function useSurahTabs({
  chapters,
  filteredChapters,
  filteredJuzs,
  filteredPages,
}: UseSurahTabsParams) {
  const { currentSurahId, currentJuzId, currentPageId, isTafsirPath, getInitialTab } =
    useSurahTabParams();
  const { tabs } = useSurahTabConfig();

  const [activeTab, setActiveTab] = useState<'Surah' | 'Juz' | 'Page'>(getInitialTab);

  const {
    selectedSurahId,
    setSelectedSurahId,
    selectedJuzId,
    setSelectedJuzId,
    selectedPageId,
    setSelectedPageId,
  } = useSelectionSync({
    currentSurahId,
    currentJuzId,
    currentPageId,
    chapters,
  });

  const { scrollRef, handleScroll, prepareForTabSwitch, rememberScroll } = useSidebarScroll({
    activeTab,
    selectedSurahId,
    selectedJuzId,
    selectedPageId,
  });

  const tabContentProps = {
    activeTab,
    filteredChapters,
    filteredJuzs,
    filteredPages,
    chapters,
    selectedSurahId,
    setSelectedSurahId,
    selectedJuzId,
    setSelectedJuzId,
    selectedPageId,
    setSelectedPageId,
    rememberScroll,
    isTafsirPath,
  } as const;

  return {
    tabs,
    activeTab,
    setActiveTab,
    scrollRef,
    handleScroll,
    prepareForTabSwitch,
    tabContentProps,
  } as const;
}
