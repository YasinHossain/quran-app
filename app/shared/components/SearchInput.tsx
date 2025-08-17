'use client';
import React from 'react';
import { SearchSolidIcon } from '../icons';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  onKeyDown,
  className = '',
}: SearchInputProps) => {
  const searchBarClasses =
    'bg-background text-foreground border border-border placeholder:text-muted';

  return (
    <div className={`relative ${className}`}>
      <SearchSolidIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className={`w-full pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-accent-hover ${searchBarClasses}`}
      />
    </div>
  );
};
