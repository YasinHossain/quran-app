'use client';
import { memo, useCallback } from 'react';

import { useQuickSearch } from './hooks/useQuickSearch';
import { QuickSearchModal } from './QuickSearchModal';
import { SearchSuggestions } from './SearchSuggestions';

interface QuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearch = memo(function QuickSearch({ isOpen, onClose }: QuickSearchProps): React.JSX.Element {
  const { query, setQuery, recentSearches, trendingSearches, handleSearch } =
    useQuickSearch(onClose);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSearch(query);
      else if (e.key === 'Escape') onClose();
    },
    [handleSearch, query, onClose]
  );

  return (
    <QuickSearchModal
      isOpen={isOpen}
      onClose={onClose}
      query={query}
      setQuery={setQuery}
      handleKeyDown={handleKeyDown}
    >
      <SearchSuggestions
        query={query}
        recentSearches={recentSearches}
        trendingSearches={trendingSearches}
        onSearch={handleSearch}
      />
    </QuickSearchModal>
  );
});
