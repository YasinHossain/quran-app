'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface TranslationSearchProps {
  theme: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const TranslationSearch: React.FC<TranslationSearchProps> = ({
  theme,
  searchTerm,
  setSearchTerm,
}) => (
  <div className="relative">
    <Search
      className={`h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
      }`}
    />
    <input
      type="text"
      placeholder="Search by name or style..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className={`w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-300 transition border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500'
          : 'bg-gray-50 border-slate-200 text-slate-900 placeholder-slate-400'
      }`}
    />
  </div>
);

export default TranslationSearch;
