'use client';

import { memo, useState } from 'react';

import { SidebarTabs } from '../surah-sidebar/components/SidebarTabs';
import { useSelectionSync } from '../surah-sidebar/hooks/useSelectionSync';
import { useSidebarScroll } from '../surah-sidebar/useSidebarScroll';
import { TabContent } from './surah-tabs/TabContent';
import { useSurahTabConfig } from './surah-tabs/useSurahTabConfig';
import { useSurahTabParams } from './surah-tabs/useSurahTabParams';

import type { Chapter } from '@/types';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

interface SurahTabsProps {
  chapters: Chapter[];
  filteredChapters: Chapter[];
  filteredJuzs: JuzSummary[];
  filteredPages: number[];
  searchInput: React.ReactNode;
}

export const SurahTabs = memo(function SurahTabs({
  chapters,
  filteredChapters,
  filteredJuzs,
  filteredPages,
  searchInput,
}: SurahTabsProps) {
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

  return (
    <>
      <div className="p-3 sm:p-4 border-b border-border md:border-b-0 md:p-3 md:pb-1">
        <SidebarTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          prepareForTabSwitch={prepareForTabSwitch}
        />
      </div>
      {searchInput}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 touch-pan-y"
      >
        <TabContent
          activeTab={activeTab}
          filteredChapters={filteredChapters}
          filteredJuzs={filteredJuzs}
          filteredPages={filteredPages}
          chapters={chapters}
          selectedSurahId={selectedSurahId}
          setSelectedSurahId={setSelectedSurahId}
          selectedJuzId={selectedJuzId}
          setSelectedJuzId={setSelectedJuzId}
          selectedPageId={selectedPageId}
          setSelectedPageId={setSelectedPageId}
          rememberScroll={rememberScroll}
          isTafsirPath={isTafsirPath}
        />
      </div>
    </>
  );
});
