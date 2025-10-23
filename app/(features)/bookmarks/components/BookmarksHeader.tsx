'use client';

import React from 'react';

import { PlusIcon } from '@/app/shared/icons';
import { useResponsiveState } from '@/lib/responsive';

import { HeaderTitleSection } from './header/HeaderTitleSection';

interface BookmarksHeaderProps {
  onSidebarToggle?: (() => void) | undefined;
  title?: string;
  sortBy?: 'recent' | 'name-asc' | 'name-desc' | 'most-verses';
  onSortChange?: ((sort: 'recent' | 'name-asc' | 'name-desc' | 'most-verses') => void) | undefined;
  searchTerm?: string;
  onSearchChange?: ((value: string) => void) | undefined;
  onNewFolderClick?: (() => void) | undefined;
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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <HeaderTitleSection
        title={title}
        showMenuButton={showMenuButton}
        onSidebarToggle={onSidebarToggle}
      />
      <div className="flex items-center gap-3 self-start sm:self-auto">
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
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation select-none min-h-touch"
          >
            <PlusIcon size={18} />
            Create Folder
          </button>
        )}
      </div>
    </div>
  );
};
