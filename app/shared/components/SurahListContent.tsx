'use client';

import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SearchInput } from './SearchInput';
import { SurahTabs } from './SurahTabs';
import { useSurahListFilters } from '../hooks/useSurahListFilters';

import type { Chapter } from '@/types';

interface SurahListContentProps {
  chapters: Chapter[];
}

export const SurahListContent = memo(function SurahListContent({
  chapters,
}: SurahListContentProps): React.JSX.Element {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredChapters, filteredJuzs, filteredPages } = useSurahListFilters(
    chapters,
    searchTerm
  );

  const searchInput = (
    <div className="p-3 sm:p-4 border-b border-border md:border-b-0 md:pb-2">
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={t('search_surah')}
        variant="panel"
        className="text-mobile"
      />
    </div>
  );

  return (
    <SurahTabs
      chapters={chapters}
      filteredChapters={filteredChapters}
      filteredJuzs={filteredJuzs}
      filteredPages={filteredPages}
      searchInput={searchInput}
    />
  );
});
