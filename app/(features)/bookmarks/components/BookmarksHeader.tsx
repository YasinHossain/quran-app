'use client';

import React from 'react';
import { SearchInput } from '@/app/shared/components/SearchInput';
import { BarsIcon, SearchIcon } from '@/app/shared/icons';
import { PlusIcon } from '@/app/shared/icons';
import { Button } from '@/app/shared/ui/Button';
import { useResponsiveState } from '@/lib/responsive';

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
      {/* Main Header Section - Cleaner layout */}
      <div className="flex items-start justify-between gap-4 mb-5">
        {/* Left Section - Title and Menu */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showMenuButton && onSidebarToggle && (
            <Button
              variant="icon-round"
              size="icon"
              onClick={onSidebarToggle}
              aria-label="Toggle sidebar"
              className="hover:shadow-sm transition-shadow flex-shrink-0"
            >
              <BarsIcon size={18} />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">{title}</h1>
            <p className="text-sm text-muted">
              Organize your favorite verses
              {stats && (
                <span className="ml-2 text-xs bg-surface px-2 py-1 rounded-md">
                  {stats.folders} folders • {stats.verses} verses
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={onNewFolderClick}
            variant="primary"
            size="sm"
            className="flex items-center gap-2 px-4 py-2 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            <PlusIcon size={16} />
            <span>New Folder</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Section - Better organized */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0 max-w-sm">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
            size={16}
          />
          <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search folders..."
            size="sm"
            className="pl-9 pr-4 py-2.5 w-full bg-surface border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:shadow-md focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
          />
        </div>

        {onSortChange && (
          <div className="flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
              className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent shadow-sm hover:shadow-md transition-all duration-200"
            >
              <option value="recent">Recent</option>
              <option value="name-asc">A–Z</option>
              <option value="name-desc">Z–A</option>
              <option value="most-verses">Most verses</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
