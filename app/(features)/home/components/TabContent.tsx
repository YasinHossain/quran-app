'use client';

import { memo } from 'react';

import { JuzTab } from './JuzTab';
import { PageTab } from './PageTab';
import { SurahTab } from './SurahTab';

type TabType = 'Surah' | 'Juz' | 'Page';

interface TabContentProps {
  activeTab: TabType;
  searchQuery: string;
}

/**
 * Tab content component that renders the appropriate tab based on selection
 * Uses object mapping for cleaner conditional rendering
 */
export const TabContent = memo(function TabContent({ activeTab, searchQuery }: TabContentProps) {
  const tabComponents: Record<TabType, JSX.Element> = {
    Surah: <SurahTab searchQuery={searchQuery} />,
    Juz: <JuzTab />,
    Page: <PageTab />,
  };

  return tabComponents[activeTab];
});
