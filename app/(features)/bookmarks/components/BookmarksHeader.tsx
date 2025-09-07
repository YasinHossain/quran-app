'use client';

import React from 'react';

import { useResponsiveState } from '@/lib/responsive';

import { HeaderActions } from './header/HeaderActions';
import { HeaderTitleSection } from './header/HeaderTitleSection';
import { SearchBar } from './header/SearchBar';
import { SortDropdown } from './header/SortDropdown';

interface BookmarksHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewFolderClick: () => void;
  onSidebarToggle?: () => void;
  title?: string;
  sortBy?: 'recent' | 'name-asc' | 'name-desc' | 'most-verses';
  onSortChange?: (sort: 'recent' | 'name-asc' | 'name-desc' | 'most-verses') => void;
  stats?: { folders: number; verses: number };
}

export const BookmarksHeader = ({
  searchTerm,
  onSearchChange,
  onNewFolderClick,
  onSidebarToggle,
  title = 'Bookmarks',
  sortBy = 'recent',
  onSortChange,
  stats,
}: BookmarksHeaderProps): React.JSX.Element => {
  const { variant } = useResponsiveState();
  const showMenuButton = variant === 'compact' || variant === 'default';

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <HeaderTitleSection
          title={title}
          stats={stats}
          showMenuButton={showMenuButton}
          onSidebarToggle={onSidebarToggle}
        />
        <HeaderActions onNewFolderClick={onNewFolderClick} />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
        {onSortChange && <SortDropdown sortBy={sortBy} onSortChange={onSortChange} />}
      </div>
    </div>
  );
};
