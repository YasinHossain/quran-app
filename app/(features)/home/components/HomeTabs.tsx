'use client';
import React, { useState } from 'react';
import { useTheme } from '@/app/providers/ThemeContext';
import SurahTab from './SurahTab';
import JuzTab from './JuzTab';
import PageTab from './PageTab';

interface HomeTabsProps {
  searchQuery: string;
}

export default function HomeTabs({ searchQuery }: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState<'Surah' | 'Juz' | 'Page'>('Surah');
  const { theme } = useTheme();

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

      {activeTab === 'Surah' && <SurahTab searchQuery={searchQuery} />}
      {activeTab === 'Juz' && <JuzTab />}
      {activeTab === 'Page' && <PageTab />}
    </section>
  );
}
