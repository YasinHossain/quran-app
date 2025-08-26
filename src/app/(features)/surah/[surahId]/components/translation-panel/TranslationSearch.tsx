'use client';

import React from 'react';
import { TranslationSearchField } from '@/presentation/shared/ui/SearchField';

interface TranslationSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const TranslationSearch: React.FC<TranslationSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => <TranslationSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;

export default TranslationSearch;
