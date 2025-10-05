import { useMemo, useState } from 'react';

export interface LanguageOption {
  name: string;
  id: number;
}

export const useWordTranslationSearch = (
  languages: LanguageOption[]
): {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filteredLanguages: LanguageOption[];
} => {
  const [searchTerm, setSearchTerm] = useState('');

  const sortedLanguages = useMemo(
    () => [...languages].sort((a, b) => a.name.localeCompare(b.name)),
    [languages]
  );

  const filtered = useMemo(
    () =>
      sortedLanguages.filter((lang) => lang.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [sortedLanguages, searchTerm]
  );

  return { searchTerm, setSearchTerm, filteredLanguages: filtered };
};
