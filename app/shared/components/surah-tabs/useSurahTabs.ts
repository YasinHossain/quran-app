import { useState } from 'react';

import { useSelectionSync } from '@/app/shared/surah-sidebar/hooks/useSelectionSync';
import { useSidebarScroll } from '@/app/shared/surah-sidebar/useSidebarScroll';

import { useSurahTabConfig } from './useSurahTabConfig';
import { useSurahTabParams } from './useSurahTabParams';

import type { Chapter } from '@/types';

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

  const selections = useSelectionSync({
    currentSurahId,
    currentJuzId,
    currentPageId,
    chapters,
  });

  const scroll = useSidebarScroll({
    activeTab,
    selectedSurahId: selections.selectedSurahId,
    selectedJuzId: selections.selectedJuzId,
    selectedPageId: selections.selectedPageId,
    isEnabled: true,
  });

  const tabContentProps = buildTabContentProps({
    activeTab,
    filteredChapters,
    filteredJuzs,
    filteredPages,
    chapters,
    selections,
    rememberScroll: scroll.rememberScroll,
    isTafsirPath,
  });

  return {
    tabs,
    activeTab,
    setActiveTab,
    scrollRef: scroll.scrollRef,
    handleScroll: scroll.handleScroll,
    prepareForTabSwitch: scroll.prepareForTabSwitch,
    tabContentProps,
  } as const;
}

function buildTabContentProps({
  activeTab,
  filteredChapters,
  filteredJuzs,
  filteredPages,
  chapters,
  selections,
  rememberScroll,
  isTafsirPath,
}: {
  activeTab: 'Surah' | 'Juz' | 'Page';
  filteredChapters: Chapter[];
  filteredJuzs: { number: number; name: string; surahRange: string }[];
  filteredPages: number[];
  chapters: Chapter[];
  selections: ReturnType<typeof useSelectionSync>;
  rememberScroll: (key: string, position: number) => void;
  isTafsirPath: boolean;
}): TabContentProps {
  const {
    selectedSurahId,
    setSelectedSurahId,
    selectedJuzId,
    setSelectedJuzId,
    selectedPageId,
    setSelectedPageId,
  } = selections;

  return {
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
}
