'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface TafsirSearchProps {
  theme: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const TafsirSearch: React.FC<TafsirSearchProps> = ({ theme, searchTerm, setSearchTerm }) => (
  <div className="relative">
    <Search
      className={`h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 ${
        theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
      }`}
    />
    <input
      type="text"
      placeholder="Search tafsirs (exact match)..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition border ${
        theme === 'dark'
          ? 'bg-slate-800 border-slate-700 text-slate-200'
          : 'bg-surface border-slate-200 text-slate-900'
      }`}
    />
  </div>
);
