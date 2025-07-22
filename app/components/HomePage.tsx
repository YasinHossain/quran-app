'use client';
import React, { useState, useMemo } from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import Link from 'next/link';
import { Search, Sun, Moon } from '@/app/components/common/SvgIcons';
import surahsData from '@/data/surahs.json';
import juzData from '@/data/juz.json';
import VerseOfDay from './VerseOfDay';
import HomePageBackground from './HomePageBackground';
import type { Surah } from '@/types';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

const allSurahs: Surah[] = surahsData;
const allJuz: JuzSummary[] = juzData;
const allPages = Array.from({ length: 604 }, (_, i) => i + 1);

// --- Main Page Component ---
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Surah' | 'Juz' | 'Page'>('Surah');
  const { theme, setTheme } = useTheme();

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return allSurahs;
    return allSurahs.filter(
      surah =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    );
  }, [searchQuery]);

  const shortcutSurahs = ['Al-Mulk', 'Al-Kahf', 'Ya-Sin', 'Al-Ikhlas'];

  return (
    <>
      <div className="relative h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
        <HomePageBackground />

        <div className="relative z-10 flex flex-col h-full overflow-y-auto px-4 sm:px-6 lg:px-8">
          <header className="w-full py-4">
            <nav className="flex justify-between items-center max-w-7xl mx-auto p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-slate-700/60 rounded-2xl shadow-lg backdrop-blur-xl">
              <h1 className="text-2xl font-bold tracking-wider text-slate-900 dark:text-white">
                Al Qur&apos;an
              </h1>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 bg-black/5 dark:bg-white/10 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
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
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                The Noble Qur&apos;an
              </h2>
              <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Read! In the name of your Lord
              </p>
            </div>

            <div className="mt-10 w-full max-w-xl mx-auto content-visibility-auto animate-fade-in-up animation-delay-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What do you want to read?"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 sm:px-5 py-4 pr-12 text-lg bg-white/40 dark:bg-slate-800/40 border-white/20 dark:border-slate-700/50 rounded-xl backdrop-blur-md focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-lg placeholder:text-slate-500 dark:placeholder:text-slate-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-slate-500 dark:text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 content-visibility-auto animate-fade-in-up animation-delay-200">
              {shortcutSurahs.map(name => (
                <button
                  key={name}
                  className="px-4 sm:px-5 py-2 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-full backdrop-blur-md hover:bg-white/60 dark:hover:bg-slate-700/60 hover:scale-105 transform transition-all duration-200 text-slate-700 dark:text-slate-300 font-medium shadow-sm hover:shadow-md"
                >
                  {name}
                </button>
              ))}
            </div>

            <VerseOfDay />
          </main>

          <section id="surahs" className="py-20 max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8 content-visibility-auto animate-fade-in-up animation-delay-600">
              <h2 className="text-3xl font-bold dark:text-white">All Surahs</h2>
              <div className="flex items-center bg-black/5 dark:bg-slate-800/60 p-1 sm:p-2 rounded-full">
                <button
                  onClick={() => setActiveTab('Surah')}
                  className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeTab === 'Surah'
                      ? 'bg-white dark:bg-slate-700 shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Surah
                </button>
                <button
                  onClick={() => setActiveTab('Juz')}
                  className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeTab === 'Juz'
                      ? 'bg-white dark:bg-slate-700 shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Juz
                </button>
                <button
                  onClick={() => setActiveTab('Page')}
                  className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeTab === 'Page'
                      ? 'bg-white dark:bg-slate-700 shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Page
                </button>
              </div>
            </div>

            {activeTab === 'Surah' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSurahs.map((surah, index) => (
                  <Link
                    href={`/features/surah/${surah.number}`}
                    key={surah.number}
                    className="group p-4 sm:p-5 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/60 dark:hover:bg-slate-700/60 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 content-visibility-auto animate-fade-in-up"
                    style={{ animationDelay: `${600 + index * 15}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-black/5 dark:bg-slate-700/50 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-lg group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/20 transition-colors">
                          {surah.number}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-white text-lg">{surah.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{surah.meaning}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-amiri text-2xl text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {surah.arabicName}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{surah.verses} Verses</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {activeTab === 'Juz' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allJuz.map((juz, index) => (
                  <Link
                    href={`/features/juz/${juz.number}`}
                    key={juz.number}
                    className="group p-4 sm:p-5 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/60 dark:hover:bg-slate-700/60 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 content-visibility-auto animate-fade-in-up"
                    style={{ animationDelay: `${100 + index * 15}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-black/5 dark:bg-slate-700/50 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-lg group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/20 transition-colors">
                          {juz.number}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-white text-lg">{juz.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{juz.surahRange}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {activeTab === 'Page' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPages.map((page, index) => (
                  <Link
                    href={`/features/page/${page}`}
                    key={page}
                    className="group p-4 sm:p-5 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/60 dark:hover:bg-slate-700/60 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 content-visibility-auto animate-fade-in-up"
                    style={{ animationDelay: `${100 + index * 15}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-black/5 dark:bg-slate-700/50 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-lg group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/20 transition-colors">
                        {page}
                      </div>
                      <h3 className="font-semibold text-slate-800 dark:text-white text-lg">Page {page}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filteredSurahs.length === 0 && activeTab === 'Surah' && (
              <div className="text-center py-10 col-span-full content-visibility-auto animate-fade-in-up">
                <p className="text-slate-500 dark:text-slate-400">No Surahs found for your search.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
