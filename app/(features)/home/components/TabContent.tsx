'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';

import { SurahTab } from './SurahTab';

import type { Chapter } from '@/types';

type TabType = 'Surah' | 'Juz';

interface TabContentProps {
  activeTab: TabType;
  searchQuery: string;
  /** Pre-fetched chapters from server for SSR hydration */
  initialChapters?: ReadonlyArray<Chapter> | undefined;
}

const JuzTab = dynamic(() => import('./JuzTab').then((mod) => ({ default: mod.JuzTab })));

/**
 * Tab content component that renders the appropriate tab based on selection
 * Uses object mapping for cleaner conditional rendering
 */
export const TabContent = memo(function TabContent({
  activeTab,
  searchQuery,
  initialChapters,
}: TabContentProps) {
  if (activeTab === 'Surah')
    return <SurahTab searchQuery={searchQuery} initialChapters={initialChapters} />;
  return <JuzTab />;
});
