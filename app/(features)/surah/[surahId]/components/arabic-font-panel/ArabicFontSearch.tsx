'use client';

import React from 'react';
import { SearchInput } from '@/app/shared/components/SearchInput';

interface ArabicFontSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ArabicFontSearch: React.FC<ArabicFontSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="px-2">
      <h2 className="text-sm font-semibold px-2 mb-3 text-muted">SEARCH FONTS</h2>
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search for a font..."
        variant="panel"
        size="sm"
      />
    </div>
  );
};

export default ArabicFontSearch;
