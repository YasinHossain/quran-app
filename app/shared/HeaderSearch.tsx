import React from 'react';
import { SearchSolidIcon } from './icons';

interface Props {
  query: string;
  setQuery: (query: string) => void;
  placeholder: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const HeaderSearch = ({ query, setQuery, placeholder, onKeyDown }: Props) => {
  return (
    <div className="relative">
      <SearchSolidIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-accent bg-surface text-foreground border border-border placeholder:text-muted"
      />
    </div>
  );
};

export default HeaderSearch;
