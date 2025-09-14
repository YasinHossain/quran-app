'use client';

import React from 'react';

import { useResponsiveState } from '@/lib/responsive';

import { HeaderTitleSection } from './header/HeaderTitleSection';

interface BookmarksHeaderProps {
  onSidebarToggle?: () => void;
  title?: string;
  sortBy?: 'recent' | 'name-asc' | 'name-desc' | 'most-verses';
  onSortChange?: (sort: 'recent' | 'name-asc' | 'name-desc' | 'most-verses') => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onNewFolderClick?: () => void;
}

export const BookmarksHeader = ({
  onSidebarToggle,
  title = 'Bookmarks',
  searchTerm = '',
  onSearchChange,
  onNewFolderClick,
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
        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          {onSearchChange && (
            <div>
              <input
                aria-label="Search Bookmarks"
                placeholder="Search Bookmarks"
                className="w-48 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
          {/* New Folder */}
          {onNewFolderClick && (
            <button
              type="button"
              onClick={onNewFolderClick}
              className="inline-flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation select-none bg-accent text-on-accent hover:bg-accent-hover rounded-md px-3 py-1.5 text-sm min-h-touch"
            >
              New Folder
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
