'use client';

import React from 'react';
import { SearchIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils';

interface FolderSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export const FolderSearch: React.FC<FolderSearchProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = 'Search folders...',
}) => {
  return (
    <div className="relative">
      <SearchIcon
        width={18}
        height={18}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-4 py-3 bg-surface-secondary border border-border rounded-2xl',
          'text-foreground placeholder-muted',
          'focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent',
          'transition-colors'
        )}
      />
    </div>
  );
};
