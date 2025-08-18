'use client';
import React, { useState } from 'react';
import SurahTab from './SurahTab';
import JuzTab from './JuzTab';
import PageTab from './PageTab';

interface HomeTabsProps {
  searchQuery: string;
}

export default function HomeTabs({ searchQuery }: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState<'Surah' | 'Juz' | 'Page'>('Surah');

  return (
    <section id="surahs" className="py-20 max-w-screen-2xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8 content-visibility-auto animate-fade-in-up animation-delay-600">
        <h2 className="text-3xl font-bold text-foreground ">All Surahs</h2>
        <div className="flex items-center p-1 sm:p-2 rounded-full bg-interactive">
          <button
            onClick={() => setActiveTab('Surah')}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'Surah'
                ? 'bg-surface shadow text-foreground'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Surah
          </button>
          <button
            onClick={() => setActiveTab('Juz')}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'Juz'
                ? 'bg-surface shadow text-foreground'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Juz
          </button>
          <button
            onClick={() => setActiveTab('Page')}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'Page'
                ? 'bg-surface shadow text-foreground'
                : 'text-muted hover:text-foreground'
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
