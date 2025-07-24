// app/components/common/SurahListSidebar.tsx
'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react'; // Import useRef
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaSearch } from './SvgIcons';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import useSWR from 'swr';
import { useSidebar } from '@/app/context/SidebarContext';

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
  const [activeTab, setActiveTab] = useState('Surah'); // Canonical state: 'Surah', 'Juz', 'Page'
  const { surahId, juzId, pageId } = useParams();

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
        // Scroll the active link into view
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
        className={`fixed md:static inset-y-0 left-0 w-80 h-full overflow-y-auto bg-[var(--background)] text-[var(--foreground)] flex flex-col flex-shrink-0 shadow-[5px_0px_15px_-5px_rgba(0,0,0,0.05)] z-50 md:z-10 transition-transform duration-300 ${isSurahListOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-200/80">
          <div className="flex bg-gray-200 rounded-full p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full py-2 text-sm font-semibold rounded-full transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[var(--background)] text-teal-700 shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-[var(--background)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-b border-gray-200/80">
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
            <nav className="space-y-1">
              {filteredChapters.map((chapter) => {
                const isActive = activeSurahId === String(chapter.id);
                return (
                  <Link
                    href={`/features/surah/${chapter.id}`}
                    key={chapter.id}
                    data-active={isActive} // Add data-active attribute
                    className={`group flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors border-l-2 border-transparent hover:border-teal-600 ${
                      isActive && 'bg-teal-50 border-teal-600'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-colors ${isActive ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-slate-700/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20'}`}
                    >
                      <span>{chapter.id}</span>
                    </div>
                    <div className="flex-grow">
                      <p
                        className={`font-semibold ${isActive ? 'text-teal-800' : 'text-[var(--foreground)]'}`}
                      >
                        {chapter.name_simple}
                      </p>
                      <p className="text-xs text-gray-500">{chapter.revelation_place}</p>
                    </div>
                    <p
                      className={`font-amiri text-xl ${isActive ? 'text-teal-800' : 'text-gray-500 group-hover:text-emerald-600'}`}
                    >
                      {chapter.name_arabic}
                    </p>
                  </Link>
                );
              })}
            </nav>
          )}
          {activeTab === 'Juz' && (
            <nav className="space-y-1">
              {filteredJuzs.map((j) => {
                const isActive = activeJuzId === String(j);
                return (
                  <Link
                    href={`/features/juz/${j}`}
                    key={j}
                    data-active={isActive} // Add data-active attribute
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors border-l-2 ${
                      isActive
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-transparent hover:bg-[var(--background)] dark:hover:bg-gray-800'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-colors ${
                        isActive
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 dark:bg-slate-700/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20'
                      }`}
                    >
                      <span>{j}</span>
                    </div>
                    <p
                      className={`font-semibold ${isActive ? 'text-teal-800' : 'text-[var(--foreground)]'}`}
                    >
                      Juz {j}
                    </p>
                  </Link>
                );
              })}
            </nav>
          )}
          {activeTab === 'Page' && (
            <nav className="space-y-1">
              {filteredPages.map((p) => {
                const isActive = activePageId === String(p);
                return (
                  <Link
                    href={`/features/page/${p}`}
                    key={p}
                    data-active={isActive} // Add data-active attribute
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors border-l-2 ${
                      isActive
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-transparent hover:bg-[var(--background)] dark:hover:bg-gray-800'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-colors ${
                        isActive
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 dark:bg-slate-700/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20'
                      }`}
                    >
                      <span>{p}</span>
                    </div>
                    <p
                      className={`font-semibold ${isActive ? 'text-teal-800' : 'text-[var(--foreground)]'}`}
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
