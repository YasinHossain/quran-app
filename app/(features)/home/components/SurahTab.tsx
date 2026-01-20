'use client';
import React from 'react';

import { useSurahSearch } from '@/app/(features)/home/hooks/useSurahSearch';

import { SurahEmptyState } from './SurahEmptyState';
import { SurahGrid } from './SurahGrid';
import { SurahLoadingGrid } from './SurahLoadingGrid';

import type { Chapter } from '@/types';

interface SurahTabProps {
  searchQuery: string;
  /** Pre-fetched chapters from server for SSR hydration */
  initialChapters?: ReadonlyArray<Chapter> | undefined;
}

export function SurahTab({ searchQuery, initialChapters }: SurahTabProps): React.JSX.Element {
  const { filteredChapters, isLoading, isEmpty } = useSurahSearch(searchQuery, initialChapters);

  if (isLoading) {
    return <SurahLoadingGrid />;
  }

  if (isEmpty) {
    return <SurahEmptyState />;
  }

  return <SurahGrid chapters={filteredChapters} />;
}
