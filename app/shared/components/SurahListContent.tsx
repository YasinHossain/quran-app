'use client';

import { useParams, usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import juzData from '@/data/juz.json';
import { Chapter } from '@/types';

import { SearchInput } from './SearchInput';
import { SidebarTabs } from '../surah-sidebar/components/SidebarTabs';
import { useSelectionSync } from '../surah-sidebar/hooks/useSelectionSync';
import { Juz } from '../surah-sidebar/Juz';
import { Page } from '../surah-sidebar/Page';
import { Surah } from '../surah-sidebar/Surah';
import { useSidebarScroll } from '../surah-sidebar/useSidebarScroll';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

interface SurahListContentProps {
  chapters: Chapter[];
}

export const SurahListContent = ({ chapters }: SurahListContentProps): React.JSX.Element => {
  const { t } = useTranslation();
  const juzs = useMemo(() => juzData as JuzSummary[], []);
  const pages = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtering lists based on search term
  const term = searchTerm.toLowerCase();
  const filteredChapters = useMemo(
    () =>
      chapters.filter(
        (c) => c.name_simple.toLowerCase().includes(term) || c.id.toString().includes(searchTerm)
      ),
    [chapters, searchTerm, term]
  );
  const filteredJuzs = useMemo(
    () => juzs.filter((j) => j.number.toString().includes(searchTerm)),
    [juzs, searchTerm]
  );
  const filteredPages = useMemo(
    () => pages.filter((p) => p.toString().includes(searchTerm)),
    [pages, searchTerm]
  );

  const TABS: { key: 'Surah' | 'Juz' | 'Page'; label: string }[] = [
    { key: 'Surah', label: t('surah_tab') },
    { key: 'Juz', label: t('juz_tab') },
    { key: 'Page', label: t('page_tab') },
  ];

  return (
    <>
      {/* Tabs section */}
      <div className="p-3 sm:p-4 border-b border-border md:border-b-0 md:p-3 md:pb-1">
        <SidebarTabs
          tabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          prepareForTabSwitch={prepareForTabSwitch}
        />
      </div>

      {/* Search section */}
      <div className="p-3 sm:p-4 border-b border-border md:border-b-0 md:pb-2">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('search_surah')}
          variant="panel"
          className="text-mobile"
        />
      </div>

      {/* Content section */}
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
};
