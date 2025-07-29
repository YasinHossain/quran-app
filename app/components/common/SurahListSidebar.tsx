// app/components/common/SurahListSidebar.tsx
'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react'; // Import useRef
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaSearch } from './SvgIcons';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import useSWR from 'swr';
import { useSidebar } from '@/app/context/SidebarContext';
import { useTheme } from '@/app/context/ThemeContext';

interface Props {
  initialChapters?: Chapter[];
}

const SurahListSidebar = ({ initialChapters = [] }: Props) => {
  const { t } = useTranslation();
  const MotionLink = motion(Link);
  const { data } = useSWR('chapters', getChapters, { fallbackData: initialChapters });
  const chapters = useMemo(() => data || [], [data]);
  const juzs = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);
  const pages = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Surah'); // Canonical state: 'Surah', 'Juz', 'Page'
  const { surahId, juzId, pageId } = useParams();
  const { theme } = useTheme(); // Use the useTheme hook

  // Ref for the sidebar container
  const sidebarRef = useRef<HTMLElement>(null);

  // --- MERGED AND CORRECTED SECTION ---
  const { isSurahListOpen, setSurahListOpen } = useSidebar();
  const activeSurahId = surahId;
  const activeJuzId = juzId;
  const activePageId = pageId;

  // Effect to set the active tab based on the current route parameters
  useEffect(() => {
    if (juzId) setActiveTab('Juz');
    else if (pageId) setActiveTab('Page');
    else if (surahId) setActiveTab('Surah');
  }, [juzId, pageId, surahId]);
  // --- END MERGED AND CORRECTED SECTION ---

  // Effect to scroll to the active item when the active tab or item changes
  useEffect(() => {
    if (sidebarRef.current) {
      // Find the active link element within the sidebar
      const activeLink = sidebarRef.current.querySelector(`[data-active="true"]`);

      if (activeLink) {
        // Scroll the activeLink into view
        activeLink.scrollIntoView({
          behavior: 'smooth', // Use smooth scrolling
          block: 'center', // Align the item to the center of the view
        });
      }
    }
  }, [activeTab, activeSurahId, activeJuzId, activePageId]); // Re-run effect when active tab or item changes

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

  // Tab configuration for consistent state management
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
        ref={sidebarRef} // Assign the ref to the aside element
        className={`fixed md:static inset-y-0 left-0 w-[23rem] h-full overflow-y-auto overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] flex flex-col flex-shrink-0 shadow-[5px_0px_15px_-5px_rgba(0,0,0,0.05)] z-50 md:z-10 transition-transform duration-300 ${isSurahListOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-4 border-b border-[var(--border-color)]">
          <div
            className={`flex items-center p-1 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'}`}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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
          {' '}
          {/* Added homepage-scrollable-area class */}
          {activeTab === 'Surah' && (
            <nav className="space-y-2">
              {filteredChapters.map((chapter) => {
                const isActive = activeSurahId === String(chapter.id);

                return (
                  <MotionLink
                    href={`/features/surah/${chapter.id}`}
                    key={chapter.id}
                    data-active={isActive}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors duration-300 ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : theme === 'light' ? 'bg-white hover:bg-slate-50' : 'bg-slate-800 hover:bg-slate-700'}`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-colors shadow ${
                        isActive
                          ? 'bg-white text-emerald-600'
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
                        } ${isActive ? 'text-white group-hover:text-white' : ''}`}
                      >
                        {chapter.name_simple}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {chapter.revelation_place} • {chapter.verses_count} verses
                      </p>
                    </div>
                    <p
                      className={`font-amiri text-xl font-bold ${
                        theme === 'light'
                          ? 'text-gray-500 group-hover:text-emerald-600'
                          : 'text-gray-500 group-hover:text-emerald-400'
                      } ${isActive ? 'text-white group-hover:text-white' : ''}`}
                    >
                      {chapter.name_arabic}
                    </p>
                  </MotionLink>
                );
              })}
            </nav>
          )}
          {activeTab === 'Juz' && (
            <nav className="space-y-2">
              {filteredJuzs.map((j) => {
                const isActive = activeJuzId === String(j);
                return (
                  <MotionLink
                    href={`/features/juz/${j}`}
                    key={j}
                    data-active={isActive}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors duration-300 ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : theme === 'light' ? 'bg-white hover:bg-slate-50' : 'bg-slate-800 hover:bg-slate-700'}`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-colors shadow ${isActive ? 'bg-white text-emerald-600' : theme === 'light' ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-100' : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'}`}
                    >
                      <span>{j}</span>
                    </div>
                    <p
                      className={`font-semibold ${
                        isActive
                          ? 'text-white group-hover:text-white'
                          : theme === 'light'
                            ? 'text-slate-700 group-hover:text-emerald-600'
                            : 'text-[var(--foreground)] group-hover:text-emerald-400'
                      }`}
                    >
                      Juz {j}
                    </p>
                  </MotionLink>
                );
              })}
            </nav>
          )}
          {activeTab === 'Page' && (
            <nav className="space-y-2">
              {filteredPages.map((p) => {
                const isActive = activePageId === String(p);
                return (
                  <MotionLink
                    href={`/features/page/${p}`}
                    key={p}
                    data-active={isActive}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors duration-300 ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : theme === 'light' ? 'bg-white hover:bg-slate-50' : 'bg-slate-800 hover:bg-slate-700'}`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-colors shadow ${isActive ? 'bg-white text-emerald-600' : theme === 'light' ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-100' : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'}`}
                    >
                      <span>{p}</span>
                    </div>
                    <p
                      className={`font-semibold ${
                        isActive
                          ? 'text-white group-hover:text-white'
                          : theme === 'light'
                            ? 'text-slate-700 group-hover:text-emerald-600'
                            : 'text-[var(--foreground)] group-hover:text-emerald-400'
                      }`}
                    >
                      Page {p}
                    </p>
                  </MotionLink>
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
