'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface TafsirSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const TafsirSearch: React.FC<TafsirSearchProps> = ({ searchTerm, setSearchTerm }) => (
  <div className="relative">
    <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
    <input
      type="text"
      placeholder="Search tafsirs (exact match)..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition border bg-interactive border-border text-foreground"
    />
  </div>
);
