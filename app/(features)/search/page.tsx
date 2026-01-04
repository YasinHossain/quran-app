'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { usePaginatedSearch } from './hooks/usePaginatedSearch';
import { SearchResultsContent } from './components/SearchResultsContent';

// ============================================================================
// Search Page Content
// ============================================================================

function SearchPageContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const {
    verses,
    isLoading,
    isLoadingMore,
    error,
    currentPage,
    totalPages,
    totalResults,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    goToPage,
  } = usePaginatedSearch(query);

  return (
    <SearchResultsContent
      query={query}
      verses={verses}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      totalResults={totalResults}
      hasNextPage={hasNextPage}
      hasPrevPage={hasPrevPage}
      onNextPage={goToNextPage}
      onPrevPage={goToPrevPage}
      onGoToPage={goToPage}
    />
  );
}

// ============================================================================
// Loading Fallback
// ============================================================================

function SearchPageLoading(): React.JSX.Element {
  return (
    <div className="p-6 pt-20 md:pt-24 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-interactive/50 animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-40 bg-interactive/50 rounded animate-pulse" />
          <div className="h-4 w-60 bg-interactive/30 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-b border-border/60 py-8 animate-pulse">
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="h-10 w-3/4 rounded-md bg-interactive/50" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-32 rounded-md bg-interactive/30" />
                <div className="h-4 w-full rounded-md bg-interactive/40" />
                <div className="h-4 w-5/6 rounded-md bg-interactive/40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Export
// ============================================================================

export default function SearchPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6 pt-20 md:pt-24 max-w-4xl mx-auto">
        <Suspense fallback={<SearchPageLoading />}>
          <SearchPageContent />
        </Suspense>
      </div>
    </div>
  );
}
