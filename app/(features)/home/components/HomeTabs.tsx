'use client';
import React, { useState } from 'react';

import { TabContent } from './TabContent';
import { TabNavigation } from './TabNavigation';

interface HomeTabsProps {
  searchQuery: string;
}

export function HomeTabs({ searchQuery }: HomeTabsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'Surah' | 'Juz'>('Surah');

  return (
    <section id="surahs" className="py-16 sm:py-20 max-w-screen-2xl mx-auto w-full px-1 sm:px-2">
      <div className="flex justify-between items-center gap-3 sm:gap-4 mb-6 sm:mb-8 content-visibility-auto animate-fade-in-up animation-delay-600">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-content-primary truncate min-w-0 flex-shrink">
          {activeTab === 'Surah' ? 'All Surahs' : 'All Juz'}
        </h2>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <TabContent activeTab={activeTab} searchQuery={searchQuery} />
    </section>
  );
}
