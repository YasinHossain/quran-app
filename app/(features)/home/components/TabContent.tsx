'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';

import { SurahTab } from './SurahTab';

type TabType = 'Surah' | 'Juz';

interface TabContentProps {
  activeTab: TabType;
  searchQuery: string;
}

const JuzTab = dynamic(() => import('./JuzTab').then((mod) => ({ default: mod.JuzTab })));

/**
 * Tab content component that renders the appropriate tab based on selection
 * Uses object mapping for cleaner conditional rendering
 */
export const TabContent = memo(function TabContent({ activeTab, searchQuery }: TabContentProps) {
  if (activeTab === 'Surah') return <SurahTab searchQuery={searchQuery} />;
  return <JuzTab />;
});
