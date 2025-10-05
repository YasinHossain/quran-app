import { useState, type UIEvent } from 'react';

import { useSelectionSync } from '@/app/shared/surah-sidebar/hooks/useSelectionSync';
import { useSidebarScroll } from '@/app/shared/surah-sidebar/useSidebarScroll';

import { useSurahTabConfig } from './useSurahTabConfig';
import { useSurahTabParams } from './useSurahTabParams';

import type { TabKey } from '@/app/shared/components/surah-tabs/types';
import type { Chapter } from '@/types';

interface UseSurahTabsParams {
  chapters: ReadonlyArray<Chapter>;
  filteredChapters: ReadonlyArray<Chapter>;
  filteredJuzs: { number: number; name: string; surahRange: string }[];
  filteredPages: number[];
}

interface SurahTab {
  key: TabKey;
  label: string;
}

interface TabContentProps {
  activeTab: TabKey;
  filteredChapters: ReadonlyArray<Chapter>;
  filteredJuzs: { number: number; name: string; surahRange: string }[];
  filteredPages: number[];
  chapters: ReadonlyArray<Chapter>;
  selectedSurahId: number | null;
  setSelectedSurahId: (id: number | null) => void;
  selectedJuzId: number | null;
  setSelectedJuzId: (id: number | null) => void;
  selectedPageId: number | null;
  setSelectedPageId: (id: number | null) => void;
  rememberScroll: (tab: TabKey) => void;
  isTafsirPath: boolean;
}

interface UseSurahTabsReturn {
  tabs: SurahTab[];
  activeTab: TabKey;
  setActiveTab: React.Dispatch<React.SetStateAction<TabKey>>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: (event: UIEvent<HTMLDivElement>) => void;
  prepareForTabSwitch: (tab: TabKey) => void;
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

  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab);

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
  activeTab: TabKey;
  filteredChapters: ReadonlyArray<Chapter>;
  filteredJuzs: { number: number; name: string; surahRange: string }[];
  filteredPages: number[];
  chapters: ReadonlyArray<Chapter>;
  selections: ReturnType<typeof useSelectionSync>;
  rememberScroll: (tab: TabKey) => void;
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
