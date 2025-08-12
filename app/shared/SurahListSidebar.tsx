'use client';
import React, { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { FaSearch } from './SvgIcons';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import useSWR from 'swr';
import { useSidebar } from '@/app/providers/SidebarContext';
import { useTheme } from '@/app/providers/ThemeContext';
import juzData from '@/data/juz.json';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

const JUZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402,
  422, 442, 462, 482, 502, 522, 542, 562, 582,
];

const getJuzByPage = (page: number) => {
  for (let i = JUZ_START_PAGES.length - 1; i >= 0; i--) {
    if (page >= JUZ_START_PAGES[i]) return i + 1;
  }
  return 1;
};

const getSurahByPage = (page: number, chapters: Chapter[]) =>
  chapters.find((c) => c.pages && page >= c.pages[0] && page <= c.pages[1]);

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    isSurahListOpen,
    surahScrollTop,
    setSurahScrollTop,
    juzScrollTop,
    setJuzScrollTop,
    pageScrollTop,
    setPageScrollTop,
  } = useSidebar();

  // Centering flags per tab
  const shouldCenterRef = useRef<Record<'Surah' | 'Juz' | 'Page', boolean>>({
    Surah: true,
    Juz: true,
    Page: true,
  });

  // Read sessionStorage to decide if we should skip centering on initial load
  useLayoutEffect(() => {
    const surahSkipped = sessionStorage.getItem('skipCenterSurah') === '1';
    const juzSkipped = sessionStorage.getItem('skipCenterJuz') === '1';
    const pageSkipped = sessionStorage.getItem('skipCenterPage') === '1';

    if (surahSkipped) {
      shouldCenterRef.current.Surah = false;
      sessionStorage.removeItem('skipCenterSurah');
    }
    if (juzSkipped) {
      shouldCenterRef.current.Juz = false;
      sessionStorage.removeItem('skipCenterJuz');
    }
    if (pageSkipped) {
      shouldCenterRef.current.Page = false;
      sessionStorage.removeItem('skipCenterPage');
    }
  }, []);

  // Reset centering for inactive tabs when their selection changes
  useEffect(() => {
    if (activeTab !== 'Surah') shouldCenterRef.current.Surah = true;
  }, [selectedSurahId, activeTab]);

  useEffect(() => {
    if (activeTab !== 'Juz') shouldCenterRef.current.Juz = true;
  }, [selectedJuzId, activeTab]);

  useEffect(() => {
    if (activeTab !== 'Page') shouldCenterRef.current.Page = true;
  }, [selectedPageId, activeTab]);

  // Handle scroll restoration and centering logic
  useLayoutEffect(() => {
    if (!scrollRef.current) return;
    const sidebar = scrollRef.current;
    let top = 0;
    if (activeTab === 'Surah') {
      top = Number(sessionStorage.getItem('surahScrollTop')) || surahScrollTop;
    } else if (activeTab === 'Juz') {
      top = Number(sessionStorage.getItem('juzScrollTop')) || juzScrollTop;
    } else {
      top = Number(sessionStorage.getItem('pageScrollTop')) || pageScrollTop;
    }
    sidebar.scrollTop = top;

    const activeEl = sidebar.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      const sidebarRect = sidebar.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const isOutside = activeRect.top < sidebarRect.top || activeRect.bottom > sidebarRect.bottom;

      if (shouldCenterRef.current[activeTab] && (top === 0 || isOutside)) {
        activeEl.scrollIntoView({ block: 'center' });
      }
    }
    shouldCenterRef.current[activeTab] = false;
  }, [
    activeTab,
    surahScrollTop,
    juzScrollTop,
    pageScrollTop,
    selectedSurahId,
    selectedJuzId,
    selectedPageId,
  ]);

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
                  const top = scrollRef.current?.scrollTop ?? 0;
                  if (activeTab === 'Surah') setSurahScrollTop(top);
                  else if (activeTab === 'Juz') setJuzScrollTop(top);
                  else setPageScrollTop(top);

                  shouldCenterRef.current[key] = true;
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
            <FaSearch
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
        <div
          ref={scrollRef}
          onScroll={(e: React.UIEvent<HTMLDivElement>) => {
            const top = e.currentTarget.scrollTop;
            if (activeTab === 'Surah') {
              setSurahScrollTop(top);
              sessionStorage.setItem('surahScrollTop', String(top));
            } else if (activeTab === 'Juz') {
              setJuzScrollTop(top);
              sessionStorage.setItem('juzScrollTop', String(top));
            } else {
              setPageScrollTop(top);
              sessionStorage.setItem('pageScrollTop', String(top));
            }
          }}
          className="flex-1 min-h-0 overflow-y-auto p-2"
        >
          {activeTab === 'Surah' && (
            <ul className="space-y-2">
              {filteredChapters.map((chapter) => {
                const isActive = String(chapter.id) === selectedSurahId;
                return (
                  <li key={chapter.id}>
                    <Link
                      href={isTafsirPath ? `/tafsir/${chapter.id}/1` : `/surah/${chapter.id}`}
                      scroll={false}
                      data-active={isActive}
                      onClick={() => {
                        setSelectedSurahId(String(chapter.id));
                        const firstPage = chapter.pages?.[0] ?? 1;
                        setSelectedPageId(String(firstPage));
                        setSelectedJuzId(String(getJuzByPage(firstPage)));
                        const scrollTop = scrollRef.current?.scrollTop ?? 0;
                        setSurahScrollTop(scrollTop);
                        sessionStorage.setItem('surahScrollTop', String(scrollTop));
                        sessionStorage.setItem('skipCenterSurah', '1');
                      }}
                      className={`group flex items-center p-4 gap-4 rounded-xl transition transform hover:scale-[1.02] ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                          : theme === 'light'
                            ? 'bg-white shadow hover:bg-slate-50'
                            : 'bg-slate-800 shadow hover:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg shadow transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : theme === 'light'
                              ? 'bg-gray-100 text-teal-600 group-hover:bg-teal-100'
                              : 'bg-slate-700 text-teal-400 group-hover:bg-teal-600/20'
                        }`}
                      >
                        {chapter.id}
                      </div>
                      <div className="flex-grow">
                        <p
                          className={`font-bold ${
                            isActive
                              ? 'text-white'
                              : theme === 'light'
                                ? 'text-slate-700'
                                : 'text-[var(--foreground)]'
                          }`}
                        >
                          {chapter.name_simple}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {chapter.revelation_place} • {chapter.verses_count} verses
                        </p>
                      </div>
                      <p
                        className={`font-amiri text-xl font-bold transition-colors ${
                          isActive
                            ? 'text-white'
                            : theme === 'light'
                              ? 'text-gray-500 group-hover:text-teal-600'
                              : 'text-gray-500 group-hover:text-teal-400'
                        }`}
                      >
                        {chapter.name_arabic}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {activeTab === 'Juz' && (
            <ul className="space-y-2">
              {filteredJuzs.map((juz) => {
                const isActive = String(juz.number) === selectedJuzId;
                return (
                  <li key={juz.number}>
                    <Link
                      href={`/juz/${juz.number}`}
                      scroll={false}
                      data-active={isActive}
                      onClick={() => {
                        setSelectedJuzId(String(juz.number));
                        const page = JUZ_START_PAGES[juz.number - 1];
                        setSelectedPageId(String(page));
                        const chap = getSurahByPage(page, chapters);
                        if (chap) setSelectedSurahId(String(chap.id));
                        const scrollTop = scrollRef.current?.scrollTop ?? 0;
                        setJuzScrollTop(scrollTop);
                        sessionStorage.setItem('juzScrollTop', String(scrollTop));
                        sessionStorage.setItem('skipCenterJuz', '1');
                      }}
                      className={`group flex items-center p-4 gap-4 rounded-xl transition transform hover:scale-[1.02] ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                          : theme === 'light'
                            ? 'bg-white shadow hover:bg-slate-50'
                            : 'bg-slate-800 shadow hover:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg shadow transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : theme === 'light'
                              ? 'bg-gray-100 text-teal-600 group-hover:bg-teal-100'
                              : 'bg-slate-700 text-teal-400 group-hover:bg-teal-600/20'
                        }`}
                      >
                        {juz.number}
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${
                            isActive
                              ? 'text-white'
                              : theme === 'light'
                                ? 'text-slate-700'
                                : 'text-[var(--foreground)]'
                          }`}
                        >
                          Juz {juz.number}
                        </p>
                        <p
                          className={`text-xs ${
                            isActive
                              ? 'text-white/90'
                              : theme === 'light'
                                ? 'text-slate-600'
                                : 'text-slate-400'
                          }`}
                        >
                          {juz.surahRange}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {activeTab === 'Page' && (
            <ul className="space-y-2">
              {filteredPages.map((p) => {
                const isActive = String(p) === selectedPageId;
                return (
                  <li key={p}>
                    <Link
                      href={`/page/${p}`}
                      scroll={false}
                      data-active={isActive}
                      onClick={() => {
                        setSelectedPageId(String(p));
                        setSelectedJuzId(String(getJuzByPage(p)));
                        const chap = getSurahByPage(p, chapters);
                        if (chap) setSelectedSurahId(String(chap.id));
                        const scrollTop = scrollRef.current?.scrollTop ?? 0;
                        setPageScrollTop(scrollTop);
                        sessionStorage.setItem('pageScrollTop', String(scrollTop));
                        sessionStorage.setItem('skipCenterPage', '1');
                      }}
                      className={`group flex items-center p-4 gap-4 rounded-xl transition transform hover:scale-[1.02] ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                          : theme === 'light'
                            ? 'bg-white shadow hover:bg-slate-50'
                            : 'bg-slate-800 shadow hover:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg shadow transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : theme === 'light'
                              ? 'bg-gray-100 text-teal-600 group-hover:bg-teal-100'
                              : 'bg-slate-700 text-teal-400 group-hover:bg-teal-600/20'
                        }`}
                      >
                        {p}
                      </div>
                      <p
                        className={`font-semibold ${
                          isActive
                            ? 'text-white'
                            : theme === 'light'
                              ? 'text-slate-700'
                              : 'text-[var(--foreground)]'
                        }`}
                      >
                        Page {p}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};

export default SurahListSidebar;