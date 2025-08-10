'use client';
import React, { useState, useMemo } from 'react';
import { useTheme } from '@/app/providers/ThemeContext';
import Link from 'next/link';
import { Search, Sun, Moon } from '@/app/shared/SvgIcons';
import surahsData from '@/data/surahs.json';
import juzData from '@/data/juz.json';
import VerseOfDay from './VerseOfDay';
import HomePageBackground from './HomePageBackground';
import type { Surah } from '@/data/types';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

const allSurahs: Surah[] = surahsData;
const allJuz: JuzSummary[] = juzData;
const allPages = Array.from({ length: 604 }, (_, i) => i + 1);

// --- Main Page Component ---
/**
 * Home page for the Qur'an application.
 *
 * Features:
 * - Search bar for filtering Surahs, Juz, and pages.
 * - Tab navigation to switch between Surah, Juz, and Page views.
 * - Theme toggle to switch between light and dark modes.
 *
 * Internal state:
 * - `searchQuery` stores the user's search input.
 * - `activeTab` tracks which tab is selected.
 * - `theme` is managed via `useTheme` and toggled with `setTheme`.
 */
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Surah' | 'Juz' | 'Page'>('Surah');
  const { theme, setTheme } = useTheme();

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return allSurahs;
    return allSurahs.filter(
      (surah) =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    );
  }, [searchQuery]);

  const shortcutSurahs = ['Al-Mulk', 'Al-Kahf', 'Ya-Sin', 'Al-Ikhlas'];

  return (
    <>
      <div
        className={`relative h-screen flex flex-col ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-transparent dark:text-[var(--foreground)]'} overflow-hidden`}
      >
        <HomePageBackground />

        {/* Added homepage-scrollable-area class */}
        <div className="relative z-10 flex flex-col h-full overflow-y-auto px-4 sm:px-6 lg:px-8 homepage-scrollable-area">
          <header className="w-full py-4">
            <nav
              className={`flex justify-between items-center max-w-screen-2xl mx-auto p-3 sm:p-4 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/50'}`}
            >
              <h1
                className={`text-2xl font-bold tracking-wider ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
              >
                Al Qur&apos;an
              </h1>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 bg-white/40 dark:bg-white/10 rounded-full hover:bg-white/60 dark:hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-slate-700" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
              </button>
            </nav>
          </header>

          <main className="flex-grow flex flex-col items-center justify-center text-center pt-20 pb-10">
            <div className="content-visibility-auto animate-fade-in-up">
              <h2
                className={`text-5xl md:text-7xl font-bold tracking-tight ${theme === 'light' ? 'text-slate-800' : 'bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400'}`}
              >
                The Noble Qur&apos;an
              </h2>
              <p
                className={`mt-4 text-lg md:text-xl max-w-2xl mx-auto ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}
              >
                Read! In the name of your Lord
              </p>
            </div>

            <div className="mt-10 w-full max-w-2xl mx-auto content-visibility-auto animate-fade-in-up animation-delay-200 p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What do you want to read?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full text-lg bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-slate-500 dark:text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 content-visibility-auto animate-fade-in-up animation-delay-200">
              {shortcutSurahs.map((name) => (
                <button
                  key={name}
                  className={`px-4 sm:px-5 py-2 rounded-full font-medium shadow-sm transition-all duration-200 ${
                    theme === 'light'
                      ? 'bg-white border border-gray-200 text-slate-800 hover:bg-gray-100 hover:shadow-md'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-300 backdrop-blur-md hover:bg-slate-700/60 hover:scale-105 transform hover:shadow-md'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Apply conditional styling to VerseOfDay or its container if needed */}
            <VerseOfDay />
          </main>

          <section id="surahs" className="py-20 max-w-screen-2xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8 content-visibility-auto animate-fade-in-up animation-delay-600">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">All Surahs</h2>
              <div
                className={`flex items-center p-1 sm:p-2 rounded-full ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800/60'}`}
              >
                <button
                  onClick={() => setActiveTab('Surah')}
                  className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeTab === 'Surah'
                      ? theme === 'light'
                        ? 'bg-white shadow text-slate-900'
                        : 'bg-slate-700 text-white shadow'
                      : theme === 'light'
                        ? 'text-slate-500 hover:text-slate-800'
                        : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Surah
                </button>
                <button
                  onClick={() => setActiveTab('Juz')}
                  className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeTab === 'Juz'
                      ? theme === 'light'
                        ? 'bg-white shadow text-slate-900'
                        : 'bg-slate-700 text-white shadow'
                      : theme === 'light'
                        ? 'text-slate-500 hover:text-slate-800'
                        : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Juz
                </button>
                <button
                  onClick={() => setActiveTab('Page')}
                  className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeTab === 'Page'
                      ? theme === 'light'
                        ? 'bg-white shadow text-slate-900'
                        : 'bg-slate-700 text-white shadow'
                      : theme === 'light'
                        ? 'text-slate-500 hover:text-slate-800'
                        : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Page
                </button>
              </div>
            </div>

            {activeTab === 'Surah' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSurahs.map((surah) => (
                  <Link
                    href={`/features/surah/${surah.number}`}
                    key={surah.number}
                    className={`group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/40'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors ${theme === 'light' ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-100' : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'}`}
                        >
                          {surah.number}
                        </div>
                        <div>
                          <h3
                            className={`font-semibold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
                          >
                            {surah.name}
                          </h3>
                          <p
                            className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}
                          >
                            {surah.meaning}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-amiri text-2xl ${theme === 'light' ? 'text-slate-800 group-hover:text-emerald-600' : 'text-slate-300 group-hover:text-emerald-400'} transition-colors`}
                        >
                          {surah.arabicName}
                        </p>
                        <p
                          className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}
                        >
                          {surah.verses} Verses
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {activeTab === 'Juz' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allJuz.map((juz) => (
                  <Link
                    href={`/features/juz/${juz.number}`}
                    key={juz.number}
                    className={`group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/40'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors ${theme === 'light' ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-50/50' : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'}`}
                        >
                          {juz.number}
                        </div>
                        <div>
                          <h3
                            className={`font-semibold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
                          >
                            {juz.name}
                          </h3>
                          <p
                            className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}
                          >
                            {juz.surahRange}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {activeTab === 'Page' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allPages.map((page) => (
                  <Link
                    href={`/features/page/${page}`}
                    key={page}
                    className={`group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/40'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors ${theme === 'light' ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-50/50' : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'}`}
                      >
                        {page}
                      </div>
                      <h3
                        className={`font-semibold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
                      >
                        Page {page}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filteredSurahs.length === 0 && activeTab === 'Surah' && (
              <div className="text-center py-10 col-span-full content-visibility-auto animate-fade-in-up">
                <p className="text-slate-500 dark:text-slate-400">
                  No Surahs found for your search.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
