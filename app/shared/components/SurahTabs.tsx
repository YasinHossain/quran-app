'use client';

import { useParams, usePathname } from 'next/navigation';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SidebarTabs } from '../surah-sidebar/components/SidebarTabs';
import { useSelectionSync } from '../surah-sidebar/hooks/useSelectionSync';
import { Juz } from '../surah-sidebar/Juz';
import { Page } from '../surah-sidebar/Page';
import { Surah } from '../surah-sidebar/Surah';
import { useSidebarScroll } from '../surah-sidebar/useSidebarScroll';

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
  const { t } = useTranslation();
  const { surahId, juzId, pageId } = useParams();
  const pathname = usePathname();
  const currentSurahId = Array.isArray(surahId)
    ? Number(surahId[0])
    : surahId
      ? Number(surahId)
      : undefined;
  const currentJuzId = Array.isArray(juzId) ? Number(juzId[0]) : juzId ? Number(juzId) : undefined;
  const currentPageId = Array.isArray(pageId)
    ? Number(pageId[0])
    : pageId
      ? Number(pageId)
      : undefined;

  const [activeTab, setActiveTab] = useState<'Surah' | 'Juz' | 'Page'>(() => {
    if (currentJuzId) return 'Juz';
    if (currentPageId) return 'Page';
    return 'Surah';
  });

  const isTafsirPath = pathname?.includes('/tafsir');

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

  const tabs = useMemo(
    () => [
      { key: 'Surah', label: t('surah_tab') },
      { key: 'Juz', label: t('juz_tab') },
      { key: 'Page', label: t('page_tab') },
    ],
    [t]
  );

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
        {activeTab === 'Surah' && (
          <Surah
            chapters={filteredChapters}
            selectedSurahId={selectedSurahId}
            setSelectedSurahId={setSelectedSurahId}
            setSelectedPageId={setSelectedPageId}
            setSelectedJuzId={setSelectedJuzId}
            rememberScroll={() => rememberScroll('Surah')}
            isTafsirPath={isTafsirPath}
          />
        )}

        {activeTab === 'Juz' && (
          <Juz
            juzs={filteredJuzs}
            chapters={chapters}
            selectedJuzId={selectedJuzId}
            setSelectedJuzId={setSelectedJuzId}
            setSelectedPageId={setSelectedPageId}
            setSelectedSurahId={setSelectedSurahId}
            rememberScroll={() => rememberScroll('Juz')}
          />
        )}

        {activeTab === 'Page' && (
          <Page
            pages={filteredPages}
            chapters={chapters}
            selectedPageId={selectedPageId}
            setSelectedPageId={setSelectedPageId}
            setSelectedJuzId={setSelectedJuzId}
            setSelectedSurahId={setSelectedSurahId}
            rememberScroll={() => rememberScroll('Page')}
          />
        )}
      </div>
    </>
  );
});
