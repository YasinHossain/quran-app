'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface ArabicFontSearchProps {
  theme: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ArabicFontSearch: React.FC<ArabicFontSearchProps> = ({
  theme,
  searchTerm,
  setSearchTerm,
}) => (
  <div>
    <h2
      className={`text-sm font-semibold px-2 mb-3 ${
        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
      }`}
    >
      SEARCH FONTS
    </h2>
    <div className="relative">
      <Search
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
        }`}
      />
      <input
        type="text"
        placeholder="Search for a font..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      />
    </div>
  </div>
);

export default ArabicFontSearch;
