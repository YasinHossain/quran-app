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

interface SurahTab {
  key: string;
  label: string;
}

interface TabContentProps {
  activeTab: 'Surah' | 'Juz' | 'Page';
  filteredChapters: Chapter[];
  filteredJuzs: { number: number; name: string; surahRange: string }[];
  filteredPages: number[];
  chapters: Chapter[];
  selectedSurahId: number | null;
  setSelectedSurahId: (id: number | null) => void;
  selectedJuzId: number | null;
  setSelectedJuzId: (id: number | null) => void;
  selectedPageId: number | null;
  setSelectedPageId: (id: number | null) => void;
  rememberScroll: (key: string, position: number) => void;
  isTafsirPath: boolean;
}

interface UseSurahTabsReturn {
  tabs: SurahTab[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  scrollRef: React.RefObject<HTMLDivElement>;
  handleScroll: () => void;
  prepareForTabSwitch: () => void;
  tabContentProps: TabContentProps;
}

export function useSurahTabs({
  chapters,
  filteredChapters,
  filteredJuzs,
  filteredPages,
}: UseSurahTabsParams): UseSurahTabsReturn {
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
