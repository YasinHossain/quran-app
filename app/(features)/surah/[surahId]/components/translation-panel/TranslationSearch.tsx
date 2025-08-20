'use client';

import React from 'react';
import { SearchInput } from '@/app/shared/components/SearchInput';

interface TranslationSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const TranslationSearch: React.FC<TranslationSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => (
  <SearchInput
    value={searchTerm}
    onChange={setSearchTerm}
    placeholder="Search by name or style..."
    variant="panel"
  />
);

export default TranslationSearch;
