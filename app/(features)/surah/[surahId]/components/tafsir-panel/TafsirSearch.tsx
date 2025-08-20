'use client';

import React from 'react';
import { SearchInput } from '@/app/shared/components/SearchInput';

interface TafsirSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const TafsirSearch: React.FC<TafsirSearchProps> = ({ searchTerm, setSearchTerm }) => (
  <SearchInput
    value={searchTerm}
    onChange={setSearchTerm}
    placeholder="Search tafsirs (exact match)..."
    variant="panel"
  />
);
