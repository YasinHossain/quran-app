'use client';
import React, { useMemo } from 'react';
import { Chapter } from '@/types';
import { getChapters } from '@/lib/api';
import useSWR from 'swr';
import { useSidebar } from '@/app/providers/SidebarContext';
import { BaseSidebar } from './components/BaseSidebar';
import { SurahListContent } from './components/SurahListContent';

interface Props {
  initialChapters?: Chapter[];
}

/**
 * Sidebar with tabs for browsing Surahs, Juzs and pages.
 * Includes a search input for filtering and remembers scroll position
 * between tabs via session storage and the sidebar context.
 */
const SurahListSidebar = ({ initialChapters = [] }: Props) => {
  const { data } = useSWR('chapters', getChapters, { fallbackData: initialChapters });
  const chapters = useMemo(() => data || [], [data]);
  const { isSurahListOpen, setSurahListOpen } = useSidebar();

  return (
    <BaseSidebar
      isOpen={isSurahListOpen}
      onClose={() => setSurahListOpen(false)}
      position="left"
      aria-label="Surah navigation"
    >
      <SurahListContent chapters={chapters} />
    </BaseSidebar>
  );
};

export default SurahListSidebar;
