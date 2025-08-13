import React from 'react';
import { SearchSolidIcon } from '../../icons';

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder: string;
  theme: string;
}

const SidebarSearch = ({ searchTerm, setSearchTerm, placeholder, theme }: Props) => {
  const searchBarClasses =
    theme === 'light'
      ? 'bg-white text-gray-700 border border-gray-200 placeholder-gray-400'
      : 'bg-gray-800 text-gray-200 border border-gray-600 placeholder-gray-400';

  return (
    <div className="relative">
      <SearchSolidIcon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-teal-600 ${searchBarClasses}`}
      />
    </div>
  );
};

export default SidebarSearch;
