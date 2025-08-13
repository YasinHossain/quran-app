import React from 'react';
import { SearchSolidIcon } from './icons';
import { useTheme } from '@/app/providers/ThemeContext';

interface Props {
  query: string;
  setQuery: (query: string) => void;
  placeholder: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const HeaderSearch = ({ query, setQuery, placeholder, onKeyDown }: Props) => {
  const { theme } = useTheme();

  const searchBarClasses =
    theme === 'light'
      ? 'bg-white text-gray-700 border-none placeholder-gray-400'
      : 'bg-gray-800 text-gray-200 border-none placeholder-gray-400';

  return (
    <div className="relative">
      <SearchSolidIcon
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none transition-all duration-300 hover:shadow-lg ${searchBarClasses}`}
      />
    </div>
  );
};

export default HeaderSearch;
