'use client';

import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SidebarHeader } from '@/app/shared/components/SidebarHeader';
import { useSurahListFilters } from '@/app/shared/hooks/useSurahListFilters';

import { SearchInput } from './SearchInput';
import { SurahTabs } from './SurahTabs';

import type { Chapter } from '@/types';

interface SurahListContentProps {
  chapters: ReadonlyArray<Chapter>;
  onClose?: () => void;
}

export const SurahListContent = memo(function SurahListContent({
  chapters,
  onClose,
}: SurahListContentProps): React.JSX.Element {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const { filteredChapters, filteredJuzs, filteredPages } = useSurahListFilters(
    chapters,
    searchTerm
  );

  const searchInput = (
    <div className="p-3 sm:p-4 md:border-b-0 md:pb-2">
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
    <div className="flex flex-1 min-h-0 flex-col bg-background text-foreground">
      <SidebarHeader
        title="Quran"
        titleClassName="text-mobile-lg font-semibold text-content-primary"
        className="xl:hidden"
        showCloseButton
        {...(onClose ? { onClose } : {})}
        forceVisible
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        <SurahTabs
          chapters={chapters}
          filteredChapters={filteredChapters}
          filteredJuzs={filteredJuzs}
          filteredPages={filteredPages}
          searchInput={searchInput}
          onClose={onClose}
        />
      </div>
    </div>
  );
});
