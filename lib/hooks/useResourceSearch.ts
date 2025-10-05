import { useMemo, useState } from 'react';

interface Resource {
  id: number;
  name: string;
  lang: string;
}

interface Options<T extends Resource> {
  resources: T[];
  languageSort?: (a: string, b: string) => number;
}

export interface UseResourceSearchResult<T extends Resource> {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  activeFilter: string;
  setActiveFilter: React.Dispatch<React.SetStateAction<string>>;
  languages: string[];
  groupedResources: Record<string, T[]>;
}

export const useResourceSearch = <T extends Resource>({
  resources,
  languageSort,
}: Options<T>): UseResourceSearchResult<T> => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const languages = useMemo(() => {
    const unique = Array.from(new Set(resources.map((r) => r.lang)));
    const sorted = languageSort
      ? unique.sort(languageSort)
      : unique.sort((a, b) => a.localeCompare(b));
    return ['All', ...sorted];
  }, [resources, languageSort]);

  const filtered = useMemo(() => {
    if (searchTerm === '') return resources;
    const lower = searchTerm.toLowerCase();
    return resources.filter(
      (r) => r.name.toLowerCase().includes(lower) || r.lang.toLowerCase().includes(lower)
    );
  }, [resources, searchTerm]);

  const groupedResources = useMemo(
    () =>
      filtered.reduce(
        (acc, item) => {
          (acc[item.lang] = acc[item.lang] || []).push(item);
          return acc;
        },
        {} as Record<string, T[]>
      ),
    [filtered]
  );

  return {
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    languages,
    groupedResources,
  };
};
