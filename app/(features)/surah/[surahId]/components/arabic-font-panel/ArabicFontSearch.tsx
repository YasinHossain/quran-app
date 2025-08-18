'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface ArabicFontSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ArabicFontSearch: React.FC<ArabicFontSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => (
  <div>
    <h2 className="text-sm font-semibold px-2 mb-3 text-muted">SEARCH FONTS</h2>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
      <input
        type="text"
        placeholder="Search for a font..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors bg-surface border-border text-foreground"
      />
    </div>
  </div>
);

export default ArabicFontSearch;
