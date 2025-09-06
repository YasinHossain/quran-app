'use client';
import { IconClock, IconTrendingUp } from '@tabler/icons-react';
import { memo } from 'react';

interface SearchSuggestionsProps {
  query: string;
  recentSearches: string[];
  trendingSearches: string[];
  onSearch: (query: string) => void;
}

export const SearchSuggestions = memo(function SearchSuggestions({
  query,
  recentSearches,
  trendingSearches,
  onSearch,
}: SearchSuggestionsProps) {
  if (query.length === 0) {
    return (
      <div className="p-4 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <IconClock size={16} className="text-muted" />
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Recent</h3>
          </div>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onSearch(search)}
                className="w-full text-left p-3 hover:bg-muted/50 rounded-xl transition-colors group"
              >
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {search}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <IconTrendingUp size={16} className="text-muted" />
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">Trending</h3>
          </div>
          <div className="space-y-1">
            {trendingSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onSearch(search)}
                className="w-full text-left p-3 hover:bg-muted/50 rounded-xl transition-colors group"
              >
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {search}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-center text-muted py-8">Press Enter to search for "{query}"</div>
    </div>
  );
});
