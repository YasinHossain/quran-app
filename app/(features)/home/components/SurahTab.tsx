'use client';
import React from 'react';

import { useSurahSearch } from '@/app/(features)/home/hooks/useSurahSearch';

import { SurahEmptyState } from './SurahEmptyState';
import { SurahGrid } from './SurahGrid';
import { SurahLoadingGrid } from './SurahLoadingGrid';

interface SurahTabProps {
  searchQuery: string;
}

export function SurahTab({ searchQuery }: SurahTabProps): React.JSX.Element {
  const { filteredSurahs, isLoading, isEmpty } = useSurahSearch(searchQuery);

  if (isLoading) {
    return <SurahLoadingGrid />;
  }

  if (isEmpty) {
    return <SurahEmptyState />;
  }

  return <SurahGrid surahs={filteredSurahs} />;
}
