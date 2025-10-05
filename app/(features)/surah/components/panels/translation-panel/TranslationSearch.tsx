'use client';

import { TranslationSearchField } from '@/app/shared/ui/SearchField';

interface TranslationSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const TranslationSearch = ({
  searchTerm,
  setSearchTerm,
}: TranslationSearchProps): React.JSX.Element => (
  <TranslationSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
);
