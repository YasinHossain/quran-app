'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { PlusIcon } from '@/app/shared/icons';
import { SearchInput } from '@/app/shared/components/SearchInput';
import { Button } from '@/app/shared/ui/Button';
import { useResponsiveState } from '@/lib/responsive';

interface BookmarksHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewFolderClick: () => void;
  onSidebarToggle?: () => void;
  title?: string;
}

export const BookmarksHeader: React.FC<BookmarksHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onNewFolderClick,
  onSidebarToggle,
  title = 'Bookmarks',
}) => {
  const { variant } = useResponsiveState();
  const showMenuButton = variant === 'compact' || variant === 'default';

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {showMenuButton && onSidebarToggle && (
          <Button
            variant="icon-round"
            size="icon"
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </Button>
        )}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onNewFolderClick}
          variant="primary"
          size="sm"
          className="flex items-center space-x-2"
        >
          <PlusIcon size={16} />
          <span>New Folder</span>
        </Button>
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search Bookmarks"
          size="sm"
          className="w-48"
        />
      </div>
    </div>
  );
};
