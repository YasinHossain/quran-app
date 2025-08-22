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
import { CloseIcon } from './icons';

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
  const { isSurahListOpen, setSurahListOpen } = useSidebar();

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
      {/* Mobile drawer overlay */}
      {isSurahListOpen && (
        <div
          className="drawer-overlay md:hidden"
          onClick={() => setSurahListOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main sidebar container */}
      <aside
        className={`drawer-panel md:static top-16 md:top-0 bottom-0 left-0 w-72 sm:w-80 md:w-full bg-background text-foreground flex flex-col shadow-modal md:shadow-lg z-modal md:z-10 md:h-full ${
          isSurahListOpen ? 'open' : ''
        } md:translate-x-0`}
        style={{
          height: isSurahListOpen ? 'calc(100vh - 4rem)' : undefined,
        }}
        role="navigation"
        aria-label="Surah navigation"
      >
        {/* Mobile header with close button */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border md:block">
          <h2 className="text-lg font-semibold text-foreground md:hidden">{t('navigation')}</h2>
          <button
            onClick={() => setSurahListOpen(false)}
            className="btn-touch p-2 rounded-md hover:bg-surface/60 md:hidden"
            aria-label="Close navigation"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Tabs section */}
        <div className="p-3 sm:p-4 border-b border-border">
          <SidebarTabs
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            prepareForTabSwitch={prepareForTabSwitch}
          />
        </div>
        {/* Search section */}
        <div className="p-3 sm:p-4 border-b border-border">
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
      </aside>
    </>
  );
};

export default SurahListSidebar;
