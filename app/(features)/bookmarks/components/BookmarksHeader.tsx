'use client';

import React from 'react';

import { useResponsiveState } from '@/lib/responsive';

import { HeaderTitleSection } from './header/HeaderTitleSection';

interface BookmarksHeaderProps {
  onSidebarToggle?: () => void;
  title?: string;
  sortBy?: 'recent' | 'name-asc' | 'name-desc' | 'most-verses';
  onSortChange?: (sort: 'recent' | 'name-asc' | 'name-desc' | 'most-verses') => void;
}

export const BookmarksHeader = ({
  onSidebarToggle,
  title = 'Bookmarks',
}: BookmarksHeaderProps): React.JSX.Element => {
  const { variant } = useResponsiveState();
  const showMenuButton = variant === 'compact' || variant === 'default';

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <HeaderTitleSection
          title={title}
          showMenuButton={showMenuButton}
          onSidebarToggle={onSidebarToggle}
        />
      </div>
    </div>
  );
};
