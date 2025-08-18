'use client';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, usePathname } from 'next/navigation';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import useSWR from 'swr';
import { useSidebar } from '@/app/providers/SidebarContext';
import juzData from '@/data/juz.json';
import useSidebarScroll from './surah-sidebar/useSidebarScroll';
import Surah from './surah-sidebar/Surah';
import Juz from './surah-sidebar/Juz';
import Page from './surah-sidebar/Page';
import SidebarTabs from './surah-sidebar/components/SidebarTabs';
import { SearchInput } from './components/SearchInput';
import useSelectionSync from './surah-sidebar/hooks/useSelectionSync';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

interface Props {
  initialChapters?: Chapter[];
}

/**
 * Sidebar with tabs for browsing Surahs, Juzs and pages.
 * Includes a search input for filtering and remembers scroll position
 * between tabs via session storage and the sidebar context.
 */
const SurahListSidebar = ({ initialChapters = [] }: Props) => {
  const { t } = useTranslation();
  const { data } = useSWR('chapters', getChapters, { fallbackData: initialChapters });
  const chapters = useMemo(() => data || [], [data]);
  const juzs = useMemo(() => juzData as JuzSummary[], []);
  const pages = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);
  const [searchTerm, setSearchTerm] = useState('');

  const { surahId, juzId, pageId } = useParams();
  const pathname = usePathname();
  const currentSurahId = Array.isArray(surahId) ? surahId[0] : (surahId as string | undefined);
  const currentJuzId = Array.isArray(juzId) ? juzId[0] : (juzId as string | undefined);
  const currentPageId = Array.isArray(pageId) ? pageId[0] : (pageId as string | undefined);

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
  const { isSurahListOpen } = useSidebar();

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
      {/* This is the main sidebar container. */}
      <aside
        className={`fixed md:static top-16 md:top-0 bottom-0 left-0 w-[20.7rem] bg-background text-foreground flex flex-col shadow-lg z-40 md:z-10 md:h-full transform transition-transform duration-300 ${
          isSurahListOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-border">
          <SidebarTabs
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            prepareForTabSwitch={prepareForTabSwitch}
          />
        </div>
        <div className="p-4 border-b border-border">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('search_surah')}
          />
        </div>
        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-y-auto p-2">
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
      </aside>
    </>
  );
};

export default SurahListSidebar;
