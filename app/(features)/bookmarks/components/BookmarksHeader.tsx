'use client';

import React from 'react';

import { useResponsiveState } from '@/lib/responsive';

import { HeaderActions } from './header/HeaderActions';
import { HeaderTitleSection } from './header/HeaderTitleSection';
import { SortDropdown } from './header/SortDropdown';

interface BookmarksHeaderProps {
  onSidebarToggle?: () => void;
  title?: string;
  sortBy?: 'recent' | 'name-asc' | 'name-desc' | 'most-verses';
  onSortChange?: (sort: 'recent' | 'name-asc' | 'name-desc' | 'most-verses') => void;
  stats?: { folders: number; verses: number };
}

export const BookmarksHeader = ({
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
      <div className="flex items-center gap-3">
        <HeaderTitleSection
          title={title}
          stats={stats}
          showMenuButton={showMenuButton}
          onSidebarToggle={onSidebarToggle}
        />
      </div>
    </div>
  );
};
