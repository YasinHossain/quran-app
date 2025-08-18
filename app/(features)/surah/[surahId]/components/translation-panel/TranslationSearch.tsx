'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface TranslationSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const TranslationSearch: React.FC<TranslationSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => (
  <div className="relative">
    <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
    <input
      type="text"
      placeholder="Search by name or style..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition border bg-interactive border-border text-foreground placeholder-muted"
    />
  </div>
);

export default TranslationSearch;
