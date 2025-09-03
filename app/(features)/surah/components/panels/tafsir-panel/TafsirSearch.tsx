'use client';

import React from 'react';
import { TafsirSearchField } from '@/app/shared/ui/SearchField';

interface TafsirSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const TafsirSearch: React.FC<TafsirSearchProps> = ({ searchTerm, setSearchTerm }) => (
  <TafsirSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
);
