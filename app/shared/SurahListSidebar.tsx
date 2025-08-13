'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, usePathname } from 'next/navigation';
import { SearchSolidIcon } from './icons';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import useSWR from 'swr';
import { useSidebar } from '@/app/providers/SidebarContext';
import { useTheme } from '@/app/providers/ThemeContext';
import juzData from '@/data/juz.json';
import { getJuzByPage, getSurahByPage, JUZ_START_PAGES } from '@/lib/utils/surah-navigation';
import useSidebarScroll from './surah-sidebar/useSidebarScroll';
import Surah from './surah-sidebar/Surah';
import Juz from './surah-sidebar/Juz';
import Page from './surah-sidebar/Page';

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

  const { theme } = useTheme();
  const searchBarClasses =
    theme === 'light'
      ? 'bg-white text-gray-700 border border-gray-200 placeholder-gray-400'
      : 'bg-gray-800 text-gray-200 border border-gray-600 placeholder-gray-400';
  const isTafsirPath = pathname?.includes('/tafsir');
  const [selectedSurahId, setSelectedSurahId] = useState<string | null>(currentSurahId ?? null);
  const [selectedJuzId, setSelectedJuzId] = useState<string | null>(currentJuzId ?? null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(currentPageId ?? null);

  // Sync selection state when URL params change
  useEffect(() => {
    if (currentSurahId) {
      setSelectedSurahId(currentSurahId);
      const chapter = chapters.find((c) => c.id === Number(currentSurahId));
      const page = chapter?.pages?.[0] ?? 1;
      setSelectedPageId(String(page));
      setSelectedJuzId(String(getJuzByPage(page)));
    } else if (currentJuzId) {
      setSelectedJuzId(currentJuzId);
      const page = JUZ_START_PAGES[Number(currentJuzId) - 1];
      setSelectedPageId(String(page));
      const chapter = getSurahByPage(page, chapters);
      if (chapter) setSelectedSurahId(String(chapter.id));
    } else if (currentPageId) {
      setSelectedPageId(currentPageId);
      const page = Number(currentPageId);
      setSelectedJuzId(String(getJuzByPage(page)));
      const chapter = getSurahByPage(page, chapters);
      if (chapter) setSelectedSurahId(String(chapter.id));
    }
  }, [currentSurahId, currentJuzId, currentPageId, chapters]);

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
        className={`fixed md:static top-16 md:top-0 bottom-0 left-0 w-[20.7rem] bg-white dark:bg-[var(--background)] text-[var(--foreground)] flex flex-col shadow-lg z-40 md:z-10 md:h-full transform transition-transform duration-300 ${
          isSurahListOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-[var(--border-color)]">
          <div
            className={`flex items-center p-1 rounded-full ${
              theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'
            }`}
          >
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  prepareForTabSwitch(key);
                  setActiveTab(key);
                }}
                className={`w-1/3 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  activeTab === key
                    ? theme === 'light'
                      ? 'bg-white text-slate-900 shadow'
                      : 'bg-slate-700 text-white shadow'
                    : theme === 'light'
                      ? 'text-slate-400 hover:text-slate-700'
                      : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="relative">
            <SearchSolidIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={t('search_surah')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-teal-600 ${searchBarClasses}`}
            />
          </div>
        </div>
        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-y-auto p-2">
          {activeTab === 'Surah' && (
            <Surah
              chapters={filteredChapters}
              theme={theme}
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
              theme={theme}
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
              theme={theme}
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
