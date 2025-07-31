'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaSearch } from './SvgIcons';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import useSWR from 'swr';
import { useSidebar } from '@/app/context/SidebarContext';
import { useTheme } from '@/app/context/ThemeContext';

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

const SurahListSidebar = ({ initialChapters = [] }: Props) => {
  const { t } = useTranslation();
  const { data } = useSWR('chapters', getChapters, { fallbackData: initialChapters });
  const chapters = useMemo(() => data || [], [data]);
  const juzs = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);
  const pages = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);
  const [searchTerm, setSearchTerm] = useState('');
  const { surahId, juzId, pageId } = useParams();
  const currentSurahId = Array.isArray(surahId) ? surahId[0] : surahId;
  const currentJuzId = Array.isArray(juzId) ? juzId[0] : juzId;
  const currentPageId = Array.isArray(pageId) ? pageId[0] : pageId;
  const [activeTab, setActiveTab] = useState(() => {
    if (currentJuzId) return 'Juz';
    if (currentPageId) return 'Page';
    return 'Surah';
  });
  const { theme } = useTheme();

  const [selectedSurahId, setSelectedSurahId] = useState<string | null>(currentSurahId ?? null);
  const [selectedJuzId, setSelectedJuzId] = useState<string | null>(currentJuzId ?? null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(currentPageId ?? null);

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

  const sidebarRef = useRef<HTMLElement>(null);

  const {
    isSurahListOpen,
    setSurahListOpen,
    surahScrollTop,
    setSurahScrollTop,
    juzScrollTop,
    setJuzScrollTop,
    pageScrollTop,
    setPageScrollTop,
  } = useSidebar();

  useEffect(() => {
    if (!sidebarRef.current) return;
    if (activeTab === 'Surah') sidebarRef.current.scrollTop = surahScrollTop;
    else if (activeTab === 'Juz') sidebarRef.current.scrollTop = juzScrollTop;
    else if (activeTab === 'Page') sidebarRef.current.scrollTop = pageScrollTop;
  }, [activeTab, surahScrollTop, juzScrollTop, pageScrollTop]);

  const filteredChapters = useMemo(
    () =>
      chapters.filter(
        (chapter) =>
          chapter.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chapter.id.toString().includes(searchTerm)
      ),
    [chapters, searchTerm]
  );
  const filteredJuzs = useMemo(
    () => juzs.filter((j) => j.toString().includes(searchTerm)),
    [juzs, searchTerm]
  );
  const filteredPages = useMemo(
    () => pages.filter((p) => p.toString().includes(searchTerm)),
    [pages, searchTerm]
  );

  const TABS = [
    { key: 'Surah', label: t('surah_tab') },
    { key: 'Juz', label: t('juz_tab') },
    { key: 'Page', label: t('page_tab') },
  ];

  return (
    <>
      {/* Overlay for mobile view */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden ${isSurahListOpen ? '' : 'hidden'}`}
        role="button"
        tabIndex={0}
        onClick={() => setSurahListOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            setSurahListOpen(false);
          }
        }}
      />
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        onScroll={() => {
          const top = sidebarRef.current?.scrollTop ?? 0;
          if (activeTab === 'Surah') setSurahScrollTop(top);
          else if (activeTab === 'Juz') setJuzScrollTop(top);
          else if (activeTab === 'Page') setPageScrollTop(top);
        }}
        className={`fixed md:static inset-y-0 left-0 w-[23rem] h-full overflow-y-auto overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] flex flex-col flex-shrink-0 shadow-[5px_0px_15px_-5px_rgba(0,0,0,0.05)] z-50 md:z-10 transition-transform duration-300 ${isSurahListOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-4 border-b border-[var(--border-color)]">
          <div
            className={`flex items-center p-1 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'}`}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  const top = sidebarRef.current?.scrollTop ?? 0;
                  if (activeTab === 'Surah') setSurahScrollTop(top);
                  else if (activeTab === 'Juz') setJuzScrollTop(top);
                  else if (activeTab === 'Page') setPageScrollTop(top);
                  setActiveTab(tab.key);
                }}
                className={`w-1/3 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === tab.key ? (theme === 'light' ? 'bg-white shadow text-slate-900' : 'bg-slate-700 text-white shadow') : theme === 'light' ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label}
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
              className="w-full bg-[var(--background)] border border-gray-200/80 dark:border-gray-600 rounded-lg py-2 pl-9 pr-3 focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-2 homepage-scrollable-area">
          {activeTab === 'Surah' && (
            <nav className="space-y-2">
              {filteredChapters.map((chapter) => {
                const isSelected = selectedSurahId === String(chapter.id);
                return (
                  <Link
                    href={`/features/surah/${chapter.id}`}
                    scroll={false}
                    key={chapter.id}
                    data-active={isSelected}
                    onClick={() => {
                      const page = chapter.pages?.[0] ?? 1;
                      setSelectedSurahId(String(chapter.id));
                      setSelectedPageId(String(page));
                      setSelectedJuzId(String(getJuzByPage(page)));
                      setSurahScrollTop(sidebarRef.current?.scrollTop ?? 0);
                    }}
                    className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transform hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-300 ease-in-out ${isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : theme === 'light' ? 'bg-white hover:bg-slate-50' : 'bg-slate-800 hover:bg-slate-700'}`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-colors shadow ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : theme === 'light'
                            ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-100'
                            : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'
                      }`}
                    >
                      <span>{chapter.id}</span>
                    </div>
                    <div className="flex-grow">
                      <p
                        className={`font-bold ${
                          theme === 'light'
                            ? 'text-slate-700 group-hover:text-emerald-600'
                            : 'text-[var(--foreground)] group-hover:text-emerald-400'
                        } ${isSelected ? 'text-white group-hover:text-white' : ''}`}
                      >
                        {chapter.name_simple}
                      </p>
                      <p className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                        {chapter.revelation_place} • {chapter.verses_count} verses
                      </p>
                    </div>
                    <p
                      className={`font-amiri text-xl font-bold ${
                        theme === 'light'
                          ? 'text-gray-500 group-hover:text-emerald-600'
                          : 'text-gray-500 group-hover:text-emerald-400'
                      } ${isSelected ? 'text-white group-hover:text-white' : ''}`}
                    >
                      {chapter.name_arabic}
                    </p>
                  </Link>
                );
              })}
            </nav>
          )}
          {activeTab === 'Juz' && (
            <nav className="space-y-2">
              {filteredJuzs.map((j) => {
                const isSelected = selectedJuzId === String(j);
                return (
                  <Link
                    href={`/features/juz/${j}`}
                    scroll={false}
                    key={j}
                    data-active={isSelected}
                    onClick={() => {
                      setSelectedJuzId(String(j));
                      const page = JUZ_START_PAGES[j - 1];
                      setSelectedPageId(String(page));
                      const chapter = getSurahByPage(page, chapters);
                      if (chapter) setSelectedSurahId(String(chapter.id));
                      setJuzScrollTop(sidebarRef.current?.scrollTop ?? 0);
                    }}
                    className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transform hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-300 ease-in-out ${isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : theme === 'light' ? 'bg-white hover:bg-slate-50' : 'bg-slate-800 hover:bg-slate-700'}`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-colors shadow ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : theme === 'light'
                            ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-100'
                            : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'
                      }`}
                    >
                      <span>{j}</span>
                    </div>
                    <p
                      className={`font-semibold ${
                        isSelected
                          ? 'text-white group-hover:text-white'
                          : theme === 'light'
                            ? 'text-slate-700 group-hover:text-emerald-600'
                            : 'text-[var(--foreground)] group-hover:text-emerald-400'
                      }`}
                    >
                      Juz {j}
                    </p>
                  </Link>
                );
              })}
            </nav>
          )}
          {activeTab === 'Page' && (
            <nav className="space-y-2">
              {filteredPages.map((p) => {
                const isSelected = selectedPageId === String(p);
                return (
                  <Link
                    href={`/features/page/${p}`}
                    scroll={false}
                    key={p}
                    data-active={isSelected}
                    onClick={() => {
                      setSelectedPageId(String(p));
                      setSelectedJuzId(String(getJuzByPage(p)));
                      const chapter = getSurahByPage(p, chapters);
                      if (chapter) setSelectedSurahId(String(chapter.id));
                      setPageScrollTop(sidebarRef.current?.scrollTop ?? 0);
                    }}
                    className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transform hover:scale-[1.02] transition-[background-color,box-shadow,transform] duration-300 ease-in-out ${isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : theme === 'light' ? 'bg-white hover:bg-slate-50' : 'bg-slate-800 hover:bg-slate-700'}`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-colors shadow ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : theme === 'light'
                            ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-100'
                            : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'
                      }`}
                    >
                      <span>{p}</span>
                    </div>
                    <p
                      className={`font-semibold ${
                        isSelected
                          ? 'text-white group-hover:text-white'
                          : theme === 'light'
                            ? 'text-slate-700 group-hover:text-emerald-600'
                            : 'text-[var(--foreground)] group-hover:text-emerald-400'
                      }`}
                    >
                      Page {p}
                    </p>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </aside>
    </>
  );
};

export default SurahListSidebar;
