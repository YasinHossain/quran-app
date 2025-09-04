'use client';

import { TafsirSearchField } from '@/app/shared/ui/SearchField';

interface TafsirSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const TafsirSearch = ({ searchTerm, setSearchTerm }: TafsirSearchProps): JSX.Element => (
  <TafsirSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
);
