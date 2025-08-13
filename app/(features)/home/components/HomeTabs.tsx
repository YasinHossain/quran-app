'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeContext';
import surahsData from '@/data/surahs.json';
import juzData from '@/data/juz.json';
import type { Surah } from '@/types';

interface HomeTabsProps {
  searchQuery: string;
}

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

const allSurahs: Surah[] = surahsData;
const allJuz: JuzSummary[] = juzData;
const allPages = Array.from({ length: 604 }, (_, i) => i + 1);

export default function HomeTabs({ searchQuery }: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState<'Surah' | 'Juz' | 'Page'>('Surah');
  const { theme } = useTheme();

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return allSurahs;
    return allSurahs.filter(
      (surah) =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.number.toString().includes(searchQuery)
    );
  }, [searchQuery]);

  return (
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
              href={`/surah/${surah.number}`}
              key={surah.number}
              className={`group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/40'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-100'
                        : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'
                    }`}
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
              href={`/juz/${juz.number}`}
              key={juz.number}
              className={`group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/40'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors ${
                      theme === 'light'
                        ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-50/50'
                        : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'
                    }`}
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
              href={`/page/${page}`}
              key={page}
              className={`group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/40'}`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-50/50'
                      : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'
                  }`}
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
          <p className="text-slate-500 dark:text-slate-400">No Surahs found for your search.</p>
        </div>
      )}
    </section>
  );
}
