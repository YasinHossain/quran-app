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
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <HeaderTitleSection
            title={title}
            showMenuButton={showMenuButton}
            onSidebarToggle={onSidebarToggle}
          />
        </div>
        {onNewFolderClick && (
          <button
            type="button"
            aria-label="Create Folder"
            onClick={onNewFolderClick}
            className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation select-none min-h-touch"
          >
            <PlusIcon size={20} />
            <span className="sr-only">Create Folder</span>
          </button>
        )}
      </div>
      {onSearchChange && (
        <div className="flex w-full items-center justify-end">
          <input
            aria-label="Search Bookmarks"
            placeholder="Search Bookmarks"
            className="w-full sm:w-64 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
