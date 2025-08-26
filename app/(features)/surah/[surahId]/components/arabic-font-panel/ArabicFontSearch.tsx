'use client';

import React from 'react';
import { FontSearchField } from '@/app/shared/ui/SearchField';

interface ArabicFontSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ArabicFontSearch: React.FC<ArabicFontSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => <FontSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;

export default ArabicFontSearch;
