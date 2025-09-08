'use client';

import { useState, useMemo, type Dispatch, type SetStateAction } from 'react';

interface UseFilteredListOptions<T> {
  searchFields?: (keyof T)[];
  initialSearchTerm?: string;
  caseSensitive?: boolean;
}

interface UseFilteredListReturn<T> {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  filteredItems: T[];
  clearSearch: () => void;
  hasActiveFilter: boolean;
}

/**
 * Custom hook for managing filtered lists with search functionality
 * Provides consistent filtering behavior across components
 */
export function useFilteredList<T>(
  items: T[],
  options: UseFilteredListOptions<T> = {}
): UseFilteredListReturn<T> {
  const { searchFields = [], initialSearchTerm = '', caseSensitive = false } = options;

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const filteredItems = useMemo((): T[] => {
    if (!searchTerm.trim()) {
      return items;
    }

    const searchValue = caseSensitive ? searchTerm.trim() : searchTerm.toLowerCase().trim();

    return items.filter((item) => {
      // If no search fields specified, try to search in common text fields
      if (searchFields.length === 0) {
        const itemValues = Object.values(item as Record<string, unknown>)
          .filter((value) => typeof value === 'string')
          .join(' ');

        const searchTarget = caseSensitive ? itemValues : itemValues.toLowerCase();
        return searchTarget.includes(searchValue);
      }

      // Search in specified fields
      return searchFields.some((field) => {
        const fieldValue = item[field];

        if (typeof fieldValue === 'string') {
          const searchTarget = caseSensitive ? fieldValue : fieldValue.toLowerCase();
          return searchTarget.includes(searchValue);
        }

        if (typeof fieldValue === 'number') {
          return fieldValue.toString().includes(searchValue);
        }

        return false;
      });
    });
  }, [items, searchTerm, searchFields, caseSensitive]);

  const clearSearch = (): void => setSearchTerm('');
  const hasActiveFilter = searchTerm.trim() !== '';

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    clearSearch,
    hasActiveFilter,
  };
}
