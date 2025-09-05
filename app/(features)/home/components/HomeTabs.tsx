'use client';
import React, { useState } from 'react';

import { TabContent } from './TabContent';
import { TabNavigation } from './TabNavigation';

interface HomeTabsProps {
  searchQuery: string;
}

export function HomeTabs({ searchQuery }: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState<'Surah' | 'Juz' | 'Page'>('Surah');

  return (
    <section id="surahs" className="py-20 max-w-screen-2xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8 content-visibility-auto animate-fade-in-up animation-delay-600">
        <h2 className="text-3xl font-bold text-content-primary">All Surahs</h2>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <TabContent activeTab={activeTab} searchQuery={searchQuery} />
    </section>
  );
}
