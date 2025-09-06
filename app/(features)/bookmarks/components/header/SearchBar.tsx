'use client';

import React from 'react';

import { SearchInput } from '@/app/shared/components/SearchInput';
import { SearchIcon } from '@/app/shared/icons';

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps): React.JSX.Element => (
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
);

