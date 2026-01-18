'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { VerseSkeleton } from '@/app/shared/components/VerseSkeleton';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@/app/shared/icons';
import { buildSurahRoute } from '@/app/shared/navigation/routes';
import { ReaderVerseCard } from '@/app/shared/reader/VerseCard';
import { highlightMissingQueryWords } from '@/lib/utils/searchRelevance';
import { parseVerseKey } from '@/lib/utils/verse';

import type { VerseWithHighlight } from '@/app/(features)/search/hooks/usePaginatedSearch';

// ============================================================================
// Types
// ============================================================================

interface SearchResultsContentProps {
  query: string;
  verses: VerseWithHighlight[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage: (page: number) => void;
}

// ============================================================================
// Sub-components
// ============================================================================

const SearchHeader = ({
  query,
  totalResults,
  currentPage,
  totalPages,
}: {
  query: string;
  totalResults: number;
  currentPage: number;
  totalPages: number;
}): React.JSX.Element => (
  <div className="mb-6 md:mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
        <SearchIcon size={20} className="text-accent" />
      </div>
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Search Results</h1>
        <p className="text-sm text-muted">
          {totalResults > 0 ? (
            <>
              <span className="font-medium text-accent">{totalResults}</span> results for &quot;
              {query}&quot;
              {totalPages > 1 && (
                <span className="ml-2">
                  · Page {currentPage} of {totalPages}
                </span>
              )}
            </>
          ) : (
            <>Searching for &quot;{query}&quot;</>
          )}
        </p>
      </div>
    </div>
  </div>
);

const EmptyState = ({ query }: { query: string }): React.JSX.Element => (
  <div className="text-center py-16">
    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/10 flex items-center justify-center">
      <SearchIcon size={32} className="text-muted" />
    </div>
    <h2 className="text-lg font-semibold text-foreground mb-2">No results found</h2>
    <p className="text-muted text-sm max-w-md mx-auto">
      We couldn&apos;t find any verses matching &quot;{query}&quot;. Try different keywords or check
      your spelling.
    </p>
  </div>
);

const ErrorState = ({ error }: { error: string }): React.JSX.Element => (
  <div className="text-center py-16">
    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-status-error/10 flex items-center justify-center">
      <SearchIcon size={32} className="text-status-error" />
    </div>
    <h2 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h2>
    <p className="text-status-error text-sm">{error}</p>
  </div>
);

const LoadingSkeletons = (): React.JSX.Element => (
  <div className="space-y-0">
    {Array.from({ length: 5 }).map((_, index) => (
      <VerseSkeleton key={index} index={index} />
    ))}
  </div>
);

const Pagination = ({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onPrevPage,
  onNextPage,
  onGoToPage,
  isLoading,
}: {
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  isLoading: boolean;
}): React.JSX.Element => {
  // Generate page numbers to show
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) pages.push('ellipsis');

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('ellipsis');

      // Always show last page
      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return <></>;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pb-4">
      {/* Previous button */}
      <button
        type="button"
        onClick={onPrevPage}
        disabled={!hasPrevPage || isLoading}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-interactive/60 text-foreground"
        aria-label="Previous page"
      >
        <ChevronLeftIcon size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-muted">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onGoToPage(page)}
              disabled={isLoading}
              className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${page === currentPage
                  ? 'bg-accent text-white'
                  : 'hover:bg-interactive/60 text-foreground'
                }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={onNextPage}
        disabled={!hasNextPage || isLoading}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-interactive/60 text-foreground"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRightIcon size={16} />
      </button>
    </div>
  );
};

// ============================================================================
// Search Result Verse Item
// ============================================================================

interface SearchVerseItemProps {
  verse: VerseWithHighlight;
  index: number;
  query: string;
}

const SearchVerseItem = ({ verse, index, query }: SearchVerseItemProps): React.JSX.Element => {
  const router = useRouter();
  const { settings } = useSettings();
  const translationFontSize = settings.translationFontSize ?? 18;

  // Detect if query is in Arabic
  const isArabicQuery = useMemo(() => {
    const arabicChars = query.match(/[\u0600-\u06FF]/g) || [];
    const totalChars = query.replace(/\s/g, '').length;
    return totalChars > 0 && arabicChars.length / totalChars > 0.5;
  }, [query]);

  // Highlight the appropriate text based on query language
  const highlightedText = useMemo(() => {
    if (isArabicQuery) {
      // Arabic query: highlight Arabic text if available
      let arabicText = verse.text_uthmani || '';

      // Clean unwanted Quranic marks (stops, pauses, decorations) for cleaner search display
      // Keeps: standard diacritics, superscript alef (0670), small waw/yeh (06E5-06E6)
      // Removes:
      // - 06D6-06DC: Small pause marks
      // - 06DF-06E4: High/Low small marks (zeros, etc)
      // - 06E9: Place of Sajdah
      // - 06EA-06ED: Stops/Dots (The "circles" user reported)
      // - 06DD: End of Ayah marker
      if (arabicText) {
        arabicText = arabicText.replace(/[\u06D6-\u06DC\u06DF-\u06E4\u06E9-\u06ED\u06DD]/g, '');
        return highlightMissingQueryWords(arabicText, query);
      }
    }
    // Non-Arabic query or no Arabic text: highlight translation
    return highlightMissingQueryWords(verse.highlightedTranslation || '', query);
  }, [isArabicQuery, verse.text_uthmani, verse.highlightedTranslation, query]);

  const handleNavigateToVerse = useCallback(() => {
    const { surahNumber, ayahNumber } = parseVerseKey(verse.verse_key);
    if (surahNumber && ayahNumber) {
      router.push(buildSurahRoute(surahNumber, { startVerse: ayahNumber, forceSeq: true }), {
        scroll: false,
      });
    }
  }, [router, verse.verse_key]);

  // Create actions object for the verse card
  const actions = {
    verseKey: verse.verse_key,
    verseId: String(verse.id),
    isPlaying: false,
    isLoadingAudio: false,
    isBookmarked: false,
    onPlayPause: () => { }, // Noop - audio not supported in search results
    onNavigateToVerse: handleNavigateToVerse,
    navigateHref: (() => {
      const { surahNumber, ayahNumber } = parseVerseKey(verse.verse_key);
      if (surahNumber && ayahNumber) {
        return buildSurahRoute(surahNumber, { startVerse: ayahNumber, forceSeq: true });
      }
      return undefined;
    })(),
  };

  return (
    <div
      className="transform transition-all duration-300 ease-out opacity-100 translate-y-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Custom search verse card with highlighted translation */}
      <ReaderVerseCard
        verse={verse}
        actions={actions}
        idPrefix="search-verse"
        showTranslations={false}
        showArabic={!isArabicQuery}
      >
        {/* Highlighted text with search term styling */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-normal uppercase tracking-wider text-muted-foreground">
            Search Match
          </p>
          {isArabicQuery ? (
            // Arabic query: show highlighted Arabic text
            <p
              className="text-right leading-loose text-foreground arabic-text"
              style={{
                fontSize: `${settings.arabicFontSize || 28}px`,
                fontFamily: settings.arabicFontFace || '"UthmanicHafs1Ver18", serif',
              }}
              dir="rtl"
              lang="ar"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          ) : (
            // Non-Arabic query: show highlighted translation
            <p
              className="text-left leading-relaxed text-foreground font-[family-name:var(--font-crimson-text)] search-result-text"
              style={{ fontSize: `${translationFontSize}px` }}
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          )}
        </div>
      </ReaderVerseCard>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const SearchResultsContent = ({
  query,
  verses,
  isLoading,
  isLoadingMore,
  error,
  currentPage,
  totalPages,
  totalResults,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  onGoToPage,
}: SearchResultsContentProps): React.JSX.Element => {
  // No query state
  if (!query.trim()) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/10 flex items-center justify-center">
          <SearchIcon size={32} className="text-muted" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Start searching</h2>
        <p className="text-muted text-sm">Enter a search term to find verses</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // Initial loading state
  if (isLoading) {
    return (
      <div>
        <SearchHeader query={query} totalResults={0} currentPage={1} totalPages={0} />
        <LoadingSkeletons />
      </div>
    );
  }

  // Empty results
  if (verses.length === 0) {
    return (
      <div>
        <SearchHeader query={query} totalResults={0} currentPage={1} totalPages={0} />
        <EmptyState query={query} />
      </div>
    );
  }

  // Results with pagination
  return (
    <div>
      <SearchHeader
        query={query}
        totalResults={totalResults}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* Loading overlay for page changes */}
      <div className={`relative ${isLoadingMore ? 'opacity-60 pointer-events-none' : ''}`}>
        {isLoadingMore && (
          <div className="absolute inset-0 flex items-start justify-center pt-20 z-10">
            <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Verse list */}
        <div className="space-y-0">
          {verses.map((verse, index) => (
            <SearchVerseItem
              key={`${verse.verse_key}-${currentPage}`}
              verse={verse}
              index={index}
              query={query}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onGoToPage={onGoToPage}
        isLoading={isLoadingMore}
      />
    </div>
  );
};
