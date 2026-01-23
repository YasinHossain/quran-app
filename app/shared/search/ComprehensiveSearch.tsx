'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
import { useTranslation } from 'react-i18next';

import { useDynamicFontLoader } from '@/app/hooks/useDynamicFontLoader';
import { useSettings } from '@/app/providers/SettingsContext';
import { GoToSurahVerseForm } from '@/app/shared/components/go-to/GoToSurahVerseForm';
import { SearchInput } from '@/app/shared/components/SearchInput';
import { SearchIcon, BookOpenIcon, HashIcon } from '@/app/shared/icons';
import {
  buildSurahRoute,
  buildJuzRoute,
  buildPageRoute,
  buildSearchRoute,
} from '@/app/shared/navigation/routes';
import {
  quickSearch,
  analyzeQuery,
  type SearchNavigationResult,
  type SearchVerseResult,
} from '@/lib/api/search';
import {
  getBestMatchesForDropdown,
  highlightMissingQueryWords,
  type ScoredVerseResult,
} from '@/lib/utils/searchRelevance';
import { localizeDigits } from '@/lib/text/localizeNumbers';

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
const QUICK_SEARCH_PAGE_SIZE = 10;
const MIN_TEXT_QUERY_LENGTH = 3;

const QUICK_LINKS = [
  { id: 67, fallbackName: 'Al-Mulk' },
  { id: 18, fallbackName: 'Al-Kahf' },
  { id: 36, fallbackName: 'Ya-Sin' },
  { id: 112, fallbackName: 'Al-Ikhlas' },
];

// ============================================================================
// Helpers
// ============================================================================

/**
 * Detects if a query is primarily in Arabic script
 */
function isArabicQuery(query: string): boolean {
  if (!query.trim()) return false;
  // Count Arabic characters (Arabic Unicode range)
  const arabicChars = query.match(/[\u0600-\u06FF]/g) || [];
  const totalChars = query.replace(/\s/g, '').length;
  // If more than 50% of characters are Arabic, consider it an Arabic query
  return totalChars > 0 && arabicChars.length / totalChars > 0.5;
}

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

// Helper to generate hrefs for navigation results
function getNavResultHref(result: SearchNavigationResult, query: string): string {
  switch (result.resultType) {
    case 'surah':
      return buildSurahRoute(Number(result.key));
    case 'ayah': {
      const [surah, ayahNum] = String(result.key).split(':').map(Number);
      return buildSurahRoute(surah!, { startVerse: ayahNum ?? 1 });
    }
    case 'juz':
      return buildJuzRoute(Number(result.key));
    case 'page':
      return buildPageRoute(Number(result.key));
    default:
      return buildSearchRoute(query);
  }
}

interface SearchDropdownProps {
  isLoading: boolean;
  navigationResults: SearchNavigationResult[];
  verseResults: (SearchVerseResult | ScoredVerseResult)[];
  recentSearches: RecentSearch[];
  searchQuery: string;
  highlightedIndex: number;
  onLinkClick: () => void;
  onSelectRecent: (query: string) => void;
  onClearRecent: () => void;
  onSearchPage: () => void;
  onClose: () => void;
}

const SearchDropdown = memo(function SearchDropdown({
  isLoading,
  navigationResults,
  verseResults,
  recentSearches,
  searchQuery,
  highlightedIndex,
  onLinkClick,
  onSelectRecent,
  onClearRecent,
  onSearchPage,
  onClose,
}: SearchDropdownProps): ReactElement {
  const { settings } = useSettings();
  const { t, i18n } = useTranslation();

  // Load Arabic font dynamically when displaying search results
  useDynamicFontLoader(settings.arabicFontFace);

  const hasQuery = searchQuery.trim().length > 0;
  const hasResults = navigationResults.length > 0 || verseResults.length > 0;
  const showRecents = !hasQuery && recentSearches.length > 0;

  // Calculate item indices for keyboard navigation
  let itemIndex = 0;

  // Maximum verses to display in dropdown
  const maxVersesToShow = QUICK_SEARCH_PAGE_SIZE;
  const visibleVerseCount = Math.min(verseResults.length, maxVersesToShow);

  const resolveNavigationResultName = (result: SearchNavigationResult): string => {
    if (result.resultType === 'surah') {
      const surahId = Number(result.key);
      if (Number.isFinite(surahId)) {
        return t(`surah_names.${surahId}`, result.name);
      }
    }

    if (result.resultType === 'juz') {
      const juzNumber = Number(result.key);
      if (Number.isFinite(juzNumber)) {
        return t('juz_number', { number: juzNumber, defaultValue: result.name });
      }
    }

    if (result.resultType === 'page') {
      const pageNumber = Number(result.key);
      if (Number.isFinite(pageNumber)) {
        return t('page_number_label', { number: pageNumber, defaultValue: result.name });
      }
    }

    if (result.resultType === 'ayah') {
      const keyLabel = typeof result.key === 'string' ? result.key : String(result.key);
      return localizeDigits(keyLabel, i18n.language);
    }

    return result.name;
  };

  const resolveNavigationResultTypeLabel = (
    resultType: SearchNavigationResult['resultType']
  ): string => {
    switch (resultType) {
      case 'surah':
        return t('search_navigation_type_surah', { defaultValue: 'Surah' });
      case 'ayah':
        return t('search_navigation_type_ayah', { defaultValue: 'Ayah' });
      case 'juz':
        return t('search_navigation_type_juz', { defaultValue: 'Juz' });
      case 'page':
        return t('search_navigation_type_page', { defaultValue: 'Page' });
      default:
        return String(resultType);
    }
  };

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] md:w-[44rem] mt-2 z-50 bg-surface-navigation rounded-xl shadow-2xl border border-border/30 dark:border-border/20 overflow-hidden">
      {/* Loading state */}
      {isLoading && hasQuery && (
        <div className="p-4 flex items-center justify-center gap-2 text-muted">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">{t('search_searching', { defaultValue: 'Searching...' })}</span>
        </div>
      )}

      {/* Recent searches */}
      {showRecents && (
        <div className="py-2">
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              {t('search_recent_searches', { defaultValue: 'Recent Searches' })}
            </span>
            <button
              type="button"
              onClick={onClearRecent}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              {t('clear', { defaultValue: 'Clear' })}
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
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              {t('go_to', { defaultValue: 'Go To' })}
            </span>
          </div>
          {navigationResults.map((result) => {
            const currentIndex = itemIndex++;
            const isHighlighted = currentIndex === highlightedIndex;
            const resultName = resolveNavigationResultName(result);
            const resultTypeLabel = resolveNavigationResultTypeLabel(result.resultType);

            return (
              <Link
                key={`${result.resultType}-${result.key}`}
                href={getNavResultHref(result, searchQuery)}
                prefetch={true}
                onClick={onLinkClick}
                className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 ${
                  isHighlighted ? 'bg-accent/20' : 'hover:bg-interactive/60'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  {result.resultType === 'surah' && (
                    <BookOpenIcon size={16} className="text-accent" />
                  )}
                  {result.resultType === 'ayah' && <HashIcon size={16} className="text-accent" />}
                  {result.resultType === 'juz' && (
                    <span className="text-xs font-bold text-accent">J</span>
                  )}
                  {result.resultType === 'page' && (
                    <span className="text-xs font-bold text-accent">P</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{resultName}</div>
                  <div className="text-xs text-muted capitalize">{resultTypeLabel}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Verse results - Header outside scrollable area */}
      {verseResults.length > 0 && (
        <div className="py-2 border-b border-border/50">
          <div className="px-4 py-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              {t('search_results_title', { defaultValue: 'Search Results' })}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">
                {t('search_showing', {
                  count: visibleVerseCount,
                  defaultValue: `Showing ${visibleVerseCount}`,
                })}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-muted hover:text-foreground transition-colors p-1 rounded hover:bg-interactive/50"
                aria-label={t('search_close_preview', { defaultValue: 'Close search preview' })}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="4" x2="4" y2="12" />
                  <line x1="4" y1="4" x2="12" y2="12" />
                </svg>
              </button>
            </div>
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
          onScroll={() => {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }}
        >
          {verseResults.slice(0, maxVersesToShow).map((verse) => {
            const currentIndex = itemIndex++;
            const isHighlighted = currentIndex === highlightedIndex;
            // Detect if the query is in Arabic
            const isArabic = isArabicQuery(searchQuery);

            return (
              <Link
                key={verse.verseKey}
                href={buildSurahRoute(verse.surahNumber, { startVerse: verse.verseNumber })}
                prefetch={true}
                onClick={onLinkClick}
                className={`w-full block px-4 py-4 text-left transition-colors border-b border-border/30 last:border-b-0 ${
                  isHighlighted ? 'bg-accent/15' : 'hover:bg-interactive/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Verse key badge */}
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md bg-accent text-white text-xs font-semibold">
                      {localizeDigits(verse.verseKey, i18n.language)}
                    </span>
                  </div>
                  {/* Verse content - show ONLY Arabic for Arabic queries, ONLY translation for other languages */}
                  <div className="flex-1 min-w-0">
                    {isArabic ? (
                      // Arabic query → Show ONLY Arabic text with highlighting
                      verse.textArabic && (
                        <p
                          className="text-right leading-loose arabic-text"
                          style={{
                            fontSize: `${settings.arabicFontSize || 28}px`,
                            fontFamily: settings.arabicFontFace || '"UthmanicHafs1Ver18", serif',
                          }}
                          dir="rtl"
                          lang="ar"
                          dangerouslySetInnerHTML={{
                            // Clean unwanted Quranic marks before highlighting, just like in the search page
                            __html: highlightMissingQueryWords(
                              verse.textArabic.replace(
                                /[\u06D6-\u06DC\u06DF-\u06E4\u06E9-\u06ED\u06DD]/g,
                                ''
                              ),
                              searchQuery
                            ),
                          }}
                        />
                      )
                    ) : (
                      // Non-Arabic query → Show ONLY translation with highlighting
                      <p
                        className="text-sm text-foreground leading-relaxed search-result-text"
                        style={{
                          fontSize: `${settings.translationFontSize ? Math.max(14, settings.translationFontSize - 2) : 16}px`,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: highlightMissingQueryWords(
                            verse.highlightedTranslation,
                            searchQuery
                          ),
                        }}
                      />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* No results */}
      {hasQuery && !isLoading && !hasResults && (
        <div className="p-6 text-center">
          <div className="text-muted text-sm mb-3">
            {t('search_no_results_for', {
              query: searchQuery,
              defaultValue: `No results found for "${searchQuery}"`,
            })}
          </div>
          <button
            type="button"
            onClick={onSearchPage}
            className="text-sm text-accent hover:underline"
          >
            {t('search_all_verses', { defaultValue: 'Search all verses →' })}
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
            {t('search_view_all_results_for', {
              query: searchQuery,
              defaultValue: `View all results for "${searchQuery}"`,
            })}
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
  placeholder,
  className = '',
  onNavigate,
  showShortcuts = false,
}: ComprehensiveSearchProps): ReactElement {
  const { t } = useTranslation();
  const router = useRouter();
  const { settings } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);

  // State
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [navigationResults, setNavigationResults] = useState<SearchNavigationResult[]>([]);
  const [verseResults, setVerseResults] = useState<SearchVerseResult[]>([]);
  const translationIds = useMemo(
    () => (settings.translationIds?.length ? settings.translationIds : [20]),
    [settings.translationIds]
  );

  // Add relevance scores for dropdown display and limit results
  const sortedVerseResults = useMemo((): ScoredVerseResult[] => {
    if (!verseResults.length || !query.trim()) return [];
    return getBestMatchesForDropdown(verseResults, query, QUICK_SEARCH_PAGE_SIZE);
  }, [verseResults, query]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      const isPortal = target.closest('[data-surah-select-portal="true"]');

      if (containerRef.current && !containerRef.current.contains(target as Node) && !isPortal) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close dropdown when route changes
  const pathname = usePathname();
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Search with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const requestId = ++requestIdRef.current;
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setNavigationResults([]);
      setVerseResults([]);
      setIsLoading(false);
      return;
    }

    // Quick parse for immediate navigation feedback
    const parsed = analyzeQuery(query);
    if (parsed.type === 'navigation' && parsed.navigationType) {
      // Create a quick navigation result even before API response
      // API will provide more details
    }

    const isShortTextQuery =
      trimmedQuery.length < MIN_TEXT_QUERY_LENGTH &&
      !(parsed.type === 'navigation' && parsed.navigationType);

    if (isShortTextQuery) {
      setNavigationResults([]);
      setVerseResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await quickSearch(query, {
          perPage: QUICK_SEARCH_PAGE_SIZE,
          translationIds,
        });
        if (requestId !== requestIdRef.current) return;
        setNavigationResults(results.navigation);
        setVerseResults(results.verses);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        console.error('Search failed:', error);
        setNavigationResults([]);
        setVerseResults([]);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
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

  const handleRecentSelect = useCallback((recentQuery: string): void => {
    setQuery(recentQuery);
    // Will trigger search via useEffect
  }, []);

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
    [
      highlightedIndex,
      navigationResults,
      verseResults,
      navigateToNavResult,
      navigateToVerse,
      navigateToSearchPage,
      query,
    ]
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
  const resolvedPlaceholder = placeholder ?? t('search_placeholder');

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <SearchInput
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        placeholder={resolvedPlaceholder}
        variant={inputVariant}
        size={inputSize}
        className="w-full"
      />

      {/* Go To Form - shown when focused but no query */}
      {isOpen && !query.trim() && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] md:w-[44rem] mt-2 z-50 bg-surface-navigation rounded-xl shadow-2xl border border-border/30 dark:border-border/20 overflow-hidden">
          <GoToSurahVerseForm
            onNavigate={(surahId, verse) => {
              const href =
                typeof verse === 'number'
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
            title={t('go_to', { defaultValue: 'Go To' })}
            buttonLabel={t('go', { defaultValue: 'Go' })}
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
          onLinkClick={() => {
            saveRecentSearch(query);
            setIsOpen(false);
            onNavigate?.();
          }}
          onSelectRecent={handleRecentSelect}
          onClearRecent={handleClearRecent}
          onSearchPage={navigateToSearchPage}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* Quick links (home variant only) */}
      {showShortcuts && variant === 'home' && (
        <div
          className="w-full mx-auto mt-4 md:mt-5"
          style={{ maxWidth: 'clamp(14rem, 65vw, 28rem)' }}
        >
          <div className="flex flex-nowrap justify-center items-center gap-1 sm:gap-1.5 md:gap-2">
            {QUICK_LINKS.map(({ id, fallbackName }) => (
              <Link
                key={id}
                href={buildSurahRoute(id)}
                prefetch={true}
                onClick={() => {
                  onNavigate?.();
                }}
                className="flex-shrink-0 min-h-[2rem] sm:min-h-[2.25rem] md:min-h-10 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full font-medium text-[0.65rem] sm:text-xs md:text-sm transition-all duration-200 bg-surface-navigation text-foreground hover:bg-surface-navigation/90 border border-border/30 dark:border-border/20 shadow-sm hover:shadow-md active:scale-95 touch-manipulation flex items-center justify-center"
              >
                {t(`surah_names.${id}`, fallbackName)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
