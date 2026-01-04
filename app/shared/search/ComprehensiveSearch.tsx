'use client';

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
} from 'react';

import { useRouter } from 'next/navigation';

import { GoToSurahVerseForm } from '@/app/shared/components/go-to/GoToSurahVerseForm';
import { SearchInput } from '@/app/shared/components/SearchInput';
import { buildSurahRoute, buildJuzRoute, buildPageRoute, buildSearchRoute } from '@/app/shared/navigation/routes';
import { useSettings } from '@/app/providers/SettingsContext';
import { quickSearch, analyzeQuery, type SearchNavigationResult, type SearchVerseResult } from '@/lib/api/search';
import { SearchIcon, BookOpenIcon, HashIcon } from '@/app/shared/icons';
import { getBestMatchesForDropdown, highlightMissingQueryWords, type ScoredVerseResult } from '@/lib/utils/searchRelevance';

// ============================================================================
// Types
// ============================================================================

interface ComprehensiveSearchProps {
  /** Visual variant of the search input */
  variant?: 'home' | 'header';
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS class */
  className?: string;
  /** Called after navigation occurs */
  onNavigate?: () => void;
  /** Show shortcut buttons below search (home variant only) */
  showShortcuts?: boolean;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

// ============================================================================
// Constants
// ============================================================================

const RECENT_SEARCHES_KEY = 'quran-recent-searches';
const MAX_RECENT_SEARCHES = 5;
const DEBOUNCE_MS = 300;

const QUICK_LINKS = [
  { name: 'Al-Mulk', id: 67 },
  { name: 'Al-Kahf', id: 18 },
  { name: 'Ya-Sin', id: 36 },
  { name: 'Al-Ikhlas', id: 112 },
];

// ============================================================================
// Helpers
// ============================================================================

function getRecentSearches(): RecentSearch[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? (JSON.parse(data) as RecentSearch[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const searches = getRecentSearches().filter(
      (s) => s.query.toLowerCase() !== query.toLowerCase()
    );
    searches.unshift({ query: query.trim(), timestamp: Date.now() });
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES))
    );
  } catch {
    // Ignore storage errors
  }
}

function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore
  }
}

// ============================================================================
// Sub-components
// ============================================================================

interface SearchDropdownProps {
  isLoading: boolean;
  navigationResults: SearchNavigationResult[];
  verseResults: (SearchVerseResult | ScoredVerseResult)[];
  recentSearches: RecentSearch[];
  searchQuery: string;
  highlightedIndex: number;
  onSelectNavigation: (result: SearchNavigationResult) => void;
  onSelectVerse: (result: SearchVerseResult) => void;
  onSelectRecent: (query: string) => void;
  onClearRecent: () => void;
  onSearchPage: () => void;
  totalResults: number;
}

const SearchDropdown = memo(function SearchDropdown({
  isLoading,
  navigationResults,
  verseResults,
  recentSearches,
  searchQuery,
  highlightedIndex,
  onSelectNavigation,
  onSelectVerse,
  onSelectRecent,
  onClearRecent,
  onSearchPage,
  totalResults,
}: SearchDropdownProps): ReactElement {
  const { settings } = useSettings();
  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = navigationResults.length > 0 || verseResults.length > 0;
  const showRecents = !hasQuery && recentSearches.length > 0;

  // Calculate item indices for keyboard navigation
  let itemIndex = 0;

  // Maximum verses to display in dropdown
  const maxVersesToShow = 10;

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] md:w-[44rem] mt-2 z-50 bg-surface rounded-xl shadow-2xl border border-border/50 overflow-hidden backdrop-blur-xl">
      {/* Loading state */}
      {isLoading && hasQuery && (
        <div className="p-4 flex items-center justify-center gap-2 text-muted">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Searching...</span>
        </div>
      )}

      {/* Recent searches */}
      {showRecents && (
        <div className="py-2">
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">Recent Searches</span>
            <button
              type="button"
              onClick={onClearRecent}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
          {recentSearches.map((search) => (
            <button
              key={search.timestamp}
              type="button"
              onClick={() => onSelectRecent(search.query)}
              className="w-full px-4 py-2.5 text-left hover:bg-interactive/60 transition-colors flex items-center gap-3"
            >
              <SearchIcon size={16} className="text-muted flex-shrink-0" />
              <span className="text-sm text-foreground truncate">{search.query}</span>
            </button>
          ))}
        </div>
      )}

      {/* Navigation results */}
      {navigationResults.length > 0 && (
        <div className="py-2 border-b border-border/50">
          <div className="px-4 py-1.5">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">Go To</span>
          </div>
          {navigationResults.map((result) => {
            const currentIndex = itemIndex++;
            const isHighlighted = currentIndex === highlightedIndex;
            
            return (
              <button
                key={`${result.resultType}-${result.key}`}
                type="button"
                onClick={() => onSelectNavigation(result)}
                className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 ${
                  isHighlighted ? 'bg-accent/20' : 'hover:bg-interactive/60'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  {result.resultType === 'surah' && <BookOpenIcon size={16} className="text-accent" />}
                  {result.resultType === 'ayah' && <HashIcon size={16} className="text-accent" />}
                  {result.resultType === 'juz' && <span className="text-xs font-bold text-accent">J</span>}
                  {result.resultType === 'page' && <span className="text-xs font-bold text-accent">P</span>}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{result.name}</div>
                  <div className="text-xs text-muted capitalize">{result.resultType}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Verse results - Header outside scrollable area */}
      {verseResults.length > 0 && (
        <div className="py-2 border-b border-border/50">
          <div className="px-4 py-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">Search Results</span>
            <span className="text-xs text-muted">{totalResults} total</span>
          </div>
        </div>
      )}

      {/* Scrollable verse results container */}
      {verseResults.length > 0 && (
        <div 
          className="max-h-[400px] overflow-y-auto overscroll-contain"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--color-border) transparent',
          }}
        >
          {verseResults.slice(0, maxVersesToShow).map((verse) => {
            const currentIndex = itemIndex++;
            const isHighlighted = currentIndex === highlightedIndex;
            
            return (
              <button
                key={verse.verseKey}
                  type="button"
                  onClick={() => onSelectVerse(verse)}
                  className={`w-full px-4 py-4 text-left transition-colors border-b border-border/30 last:border-b-0 ${
                    isHighlighted ? 'bg-accent/15' : 'hover:bg-interactive/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Verse key badge */}
                    <div className="flex-shrink-0 mt-0.5">
                      <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md bg-accent text-white text-xs font-semibold">
                        {verse.verseKey}
                      </span>
                    </div>
                    {/* Full verse translation text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm text-foreground leading-relaxed search-result-text"
                        style={{ 
                          fontSize: `${settings.translationFontSize ? Math.max(14, settings.translationFontSize - 2) : 16}px` 
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: highlightMissingQueryWords(verse.highlightedTranslation, searchQuery) 
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      )}

      {/* No results */}
      {hasQuery && !isLoading && !hasResults && (
        <div className="p-6 text-center">
          <div className="text-muted text-sm mb-3">No results found for &quot;{searchQuery}&quot;</div>
          <button
            type="button"
            onClick={onSearchPage}
            className="text-sm text-accent hover:underline"
          >
            Search all verses →
          </button>
        </div>
      )}

      {/* View all results */}
      {hasQuery && hasResults && (
        <div className="p-3 border-t border-border/50 bg-surface sticky bottom-0">
          <button
            type="button"
            onClick={onSearchPage}
            className="w-full py-2.5 px-4 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <SearchIcon size={16} />
            View all results for &quot;{searchQuery}&quot;
          </button>
        </div>
      )}
    </div>
  );
});

// ============================================================================
// Main Component
// ============================================================================

export const ComprehensiveSearch = memo(function ComprehensiveSearch({
  variant = 'home',
  placeholder = 'Search Surahs, Verses, or Topics...',
  className = '',
  onNavigate,
  showShortcuts = false,
}: ComprehensiveSearchProps): ReactElement {
  const router = useRouter();
  const { settings } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [navigationResults, setNavigationResults] = useState<SearchNavigationResult[]>([]);
  const [verseResults, setVerseResults] = useState<SearchVerseResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const translationIds = useMemo(
    () => (settings.translationIds?.length ? settings.translationIds : [20]),
    [settings.translationIds]
  );

  // Sort verse results by relevance for dropdown display
  // This prioritizes exact matches and sorts by match quality
  const sortedVerseResults = useMemo((): ScoredVerseResult[] => {
    if (!verseResults.length || !query.trim()) return [];
    return getBestMatchesForDropdown(verseResults, query, 10);
  }, [verseResults, query]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Search with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setNavigationResults([]);
      setVerseResults([]);
      setTotalResults(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Quick parse for immediate navigation feedback
    const parsed = analyzeQuery(query);
    if (parsed.type === 'navigation' && parsed.navigationType) {
      // Create a quick navigation result even before API response
      // API will provide more details
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await quickSearch(query, {
          perPage: 10,
          translationIds,
        });
        setNavigationResults(results.navigation);
        setVerseResults(results.verses);
        setTotalResults(results.pagination.totalRecords);
      } catch (error) {
        console.error('Search failed:', error);
        setNavigationResults([]);
        setVerseResults([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, translationIds]);

  // Navigation handlers
  const navigateToNavResult = useCallback(
    (result: SearchNavigationResult): void => {
      saveRecentSearch(query);
      setIsOpen(false);

      switch (result.resultType) {
        case 'surah':
          router.push(buildSurahRoute(Number(result.key)));
          break;
        case 'ayah': {
          const [surah, ayahNum] = String(result.key).split(':').map(Number);
          router.push(buildSurahRoute(surah!, { startVerse: ayahNum ?? 1 }));
          break;
        }
        case 'juz':
          router.push(buildJuzRoute(Number(result.key)));
          break;
        case 'page':
          router.push(buildPageRoute(Number(result.key)));
          break;
        default:
          router.push(buildSearchRoute(query));
      }

      onNavigate?.();
    },
    [query, router, onNavigate]
  );

  const navigateToVerse = useCallback(
    (verse: SearchVerseResult): void => {
      saveRecentSearch(query);
      setIsOpen(false);
      router.push(buildSurahRoute(verse.surahNumber, { startVerse: verse.verseNumber }));
      onNavigate?.();
    },
    [query, router, onNavigate]
  );

  const navigateToSearchPage = useCallback((): void => {
    if (query.trim()) {
      saveRecentSearch(query);
      setIsOpen(false);
      router.push(buildSearchRoute(query));
      onNavigate?.();
    }
  }, [query, router, onNavigate]);

  const handleRecentSelect = useCallback(
    (recentQuery: string): void => {
      setQuery(recentQuery);
      // Will trigger search via useEffect
    },
    []
  );

  const handleClearRecent = useCallback((): void => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>): void => {
      const totalItems = navigationResults.length + Math.min(verseResults.length, 20);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            if (highlightedIndex < navigationResults.length) {
              navigateToNavResult(navigationResults[highlightedIndex]!);
            } else {
              const verseIndex = highlightedIndex - navigationResults.length;
              navigateToVerse(verseResults[verseIndex]!);
            }
          } else if (query.trim()) {
            navigateToSearchPage();
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [highlightedIndex, navigationResults, verseResults, navigateToNavResult, navigateToVerse, navigateToSearchPage, query]
  );

  // Input handlers
  const handleInputChange = useCallback((value: string): void => {
    setQuery(value);
    setHighlightedIndex(-1);
    setIsOpen(true);
  }, []);

  const handleInputFocus = useCallback((): void => {
    setIsOpen(true);
  }, []);

  // Variant styles
  const isHeader = variant === 'header';
  const inputVariant = isHeader ? 'header' : 'glass';
  const inputSize = isHeader ? 'sm' : 'lg';

  return (
    <div
      className={`relative ${className}`}
      ref={containerRef}
    >
      <SearchInput
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        variant={inputVariant}
        size={inputSize}
        className="w-full"
      />

      {/* Go To Form - shown when focused but no query */}
      {isOpen && !query.trim() && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] md:w-[44rem] mt-2 z-50 bg-surface rounded-xl shadow-2xl border border-border/50 overflow-hidden backdrop-blur-xl">
          <GoToSurahVerseForm
            onNavigate={(surahId, verse) => {
              const href = typeof verse === 'number'
                ? buildSurahRoute(surahId, { startVerse: verse })
                : buildSurahRoute(surahId);
              router.push(href);
              setIsOpen(false);
              onNavigate?.();
            }}
            onSearchSuggestion={(suggestionQuery) => {
              setQuery(suggestionQuery);
            }}
            afterNavigate={() => setIsOpen(false)}
            title="Go To"
            subtitle="Select a Surah and optionally a verse"
            buttonLabel="Go"
          />
        </div>
      )}

      {/* Search Dropdown - shown when typing */}
      {isOpen && query.trim() && (
        <SearchDropdown
          isLoading={isLoading}
          navigationResults={navigationResults}
          verseResults={sortedVerseResults}
          recentSearches={recentSearches}
          searchQuery={query}
          highlightedIndex={highlightedIndex}
          onSelectNavigation={navigateToNavResult}
          onSelectVerse={navigateToVerse}
          onSelectRecent={handleRecentSelect}
          onClearRecent={handleClearRecent}
          onSearchPage={navigateToSearchPage}
          totalResults={totalResults}
        />
      )}

      {/* Quick links (home variant only) */}
      {showShortcuts && variant === 'home' && (
        <div
          className="w-full mx-auto mt-4 md:mt-5"
          style={{ maxWidth: 'clamp(14rem, 65vw, 28rem)' }}
        >
          <div className="flex flex-nowrap justify-center items-center gap-1 sm:gap-1.5 md:gap-2">
            {QUICK_LINKS.map(({ name, id }) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  router.push(buildSurahRoute(id));
                  onNavigate?.();
                }}
                className="flex-shrink-0 min-h-[2rem] sm:min-h-[2.25rem] md:min-h-10 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full font-medium text-[0.65rem] sm:text-xs md:text-sm transition-all duration-200 bg-surface-glass/60 text-foreground hover:bg-surface-glass/80 border-none ring-0 shadow-sm hover:shadow-md active:scale-95 backdrop-blur-xl touch-manipulation flex items-center justify-center"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
