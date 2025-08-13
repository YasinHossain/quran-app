'use client';
import React from 'react';
import { SearchSolidIcon } from '../icons';
import { useTheme } from '@/app/providers/ThemeContext';

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
  const { theme } = useTheme();
  const searchBarClasses =
    theme === 'light'
      ? 'bg-white text-gray-700 border-none placeholder-gray-400'
      : 'bg-gray-800 text-gray-200 border-none placeholder-gray-400';

  return (
    <div className={`relative ${className}`}>
      <SearchSolidIcon
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className={`w-full pl-9 pr-3 py-2 rounded-lg focus:outline-none transition-all duration-300 hover:shadow-lg ${searchBarClasses}`}
      />
    </div>
  );
};
