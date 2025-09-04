'use client';
import type React from 'react';

import { SearchInput } from '../components/SearchInput';
import type { SearchProps } from '@/types/components';

interface SearchFieldProps extends SearchProps {
  variant?: 'main' | 'default' | 'glass' | 'header' | 'panel';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Generic search field component with optional label
 * Replaces simple search wrapper components throughout the app
 */
export const SearchField = ({
  searchTerm,
  setSearchTerm,
  placeholder = 'Search...',
  variant = 'default',
  size = 'md',
  className = '',
  label,
  onKeyDown,
}: SearchFieldProps): JSX.Element => (
  <div className={className}>
    {label && (
      <h2 className="text-sm font-semibold px-2 mb-3 text-muted uppercase tracking-wide">
        {label}
      </h2>
    )}
    <SearchInput
      value={searchTerm}
      onChange={setSearchTerm}
      placeholder={placeholder}
      variant={variant}
      size={size}
      onKeyDown={onKeyDown}
    />
  </div>
);

// Predefined search fields for common use cases
export const FontSearchField = (props: Omit<SearchFieldProps, 'placeholder' | 'label'>) => (
  <SearchField
    {...props}
    label="SEARCH FONTS"
    placeholder="Search for a font..."
    variant="panel"
    size="sm"
    className="px-2"
  />
);

export const TranslationSearchField = (props: Omit<SearchFieldProps, 'placeholder'>) => (
  <SearchField {...props} placeholder="Search by name or style..." variant="panel" />
);

export const TafsirSearchField = (props: Omit<SearchFieldProps, 'placeholder'>) => (
  <SearchField {...props} placeholder="Search tafsirs (exact match)..." variant="panel" />
);

export const BookmarkSearchField = (props: Omit<SearchFieldProps, 'placeholder'>) => (
  <SearchField {...props} placeholder="Search Bookmarks" size="sm" className="w-48" />
);
