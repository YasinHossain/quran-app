'use client';

import React, { useMemo } from 'react';
import { SearchIcon, BookOpenIcon, SparklesIcon } from '@/app/shared/icons';
import { SidebarHeader } from '@/app/shared/components/SidebarHeader';
import { useSurahNavigationData } from '@/app/shared/navigation/hooks/useSurahNavigationData';
import { cn } from '@/lib/utils/cn';

import type { VerseWithHighlight } from '../hooks/usePaginatedSearch';

// ============================================================================
// Types
// ============================================================================

interface SearchLeftSidebarProps {
  query: string;
  verses: VerseWithHighlight[];
  totalResults: number;
  isLoading: boolean;
  onClose?: () => void;
}

interface SurahBreakdown {
  surahNumber: number;
  surahName: string;
  count: number;
}

// ============================================================================
// Sub-components
// ============================================================================

const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
}): React.JSX.Element => (
  <div className="flex items-center gap-2 mb-3">
    <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
      <Icon size={14} className="text-accent" />
    </div>
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h3>
  </div>
);

const BreakdownItem = ({
  surahNumber,
  surahName,
  count,
}: SurahBreakdown): React.JSX.Element => (
  <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-interactive/40 transition-colors">
    <div className="flex items-center gap-2 min-w-0">
      <span className="w-6 h-6 flex items-center justify-center text-xs font-medium rounded bg-interactive/60 text-muted-foreground shrink-0">
        {surahNumber}
      </span>
      <span className="text-sm text-foreground truncate">{surahName}</span>
    </div>
    <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
      {count}
    </span>
  </div>
);

const SearchTip = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <li className="flex gap-2 text-sm text-muted-foreground">
    <span className="text-accent shrink-0">•</span>
    <span>{children}</span>
  </li>
);

const LoadingSkeleton = (): React.JSX.Element => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-interactive/50" />
        <div className="h-4 flex-1 rounded bg-interactive/40" />
        <div className="w-8 h-5 rounded-full bg-interactive/30" />
      </div>
    ))}
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export function SearchLeftSidebar({
  query,
  verses,
  totalResults,
  isLoading,
  onClose,
}: SearchLeftSidebarProps): React.JSX.Element {
  // Get chapters data from shared hook (cached via SWR)
  const { chapters } = useSurahNavigationData();

  // Build a lookup map from chapter id to name
  const surahNameMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const chapter of chapters) {
      map.set(chapter.id, chapter.name_simple);
    }
    return map;
  }, [chapters]);

  // Compute breakdown of results by surah from current page's verses
  const surahBreakdown = useMemo((): SurahBreakdown[] => {
    const counts = new Map<number, number>();

    for (const verse of verses) {
      const [surahStr] = verse.verse_key.split(':');
      const surahNum = parseInt(surahStr ?? '0', 10);
      if (surahNum > 0) {
        counts.set(surahNum, (counts.get(surahNum) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([surahNumber, count]) => ({
        surahNumber,
        surahName: surahNameMap.get(surahNumber) ?? `Surah ${surahNumber}`,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [verses, surahNameMap]);

  const hasResults = verses.length > 0;
  const showBreakdown = hasResults && surahBreakdown.length > 0;

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground h-full">
      {/* Mobile header with close button */}
      <SidebarHeader
        title="Search Info"
        titleClassName="text-mobile-lg font-semibold text-content-primary"
        className="xl:hidden"
        showCloseButton
        {...(onClose ? { onClose } : {})}
        forceVisible
      />
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
        {/* Search Summary */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <SearchIcon size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Search Query</p>
              <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                &quot;{query}&quot;
              </p>
            </div>
          </div>
          {!isLoading && (
            <div className="mt-3 pt-3 border-t border-accent/20">
              <p className="text-2xl font-bold text-accent">{totalResults}</p>
              <p className="text-xs text-muted-foreground">total results found</p>
            </div>
          )}
        </div>

        {/* Results Breakdown by Surah */}
        <div>
          <SectionHeader icon={BookOpenIcon} title="On This Page" />
          {isLoading ? (
            <LoadingSkeleton />
          ) : showBreakdown ? (
            <div className="space-y-1">
              {surahBreakdown.slice(0, 8).map((item) => (
                <BreakdownItem key={item.surahNumber} {...item} />
              ))}
              {surahBreakdown.length > 8 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{surahBreakdown.length - 8} more surahs
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {query.trim() ? 'No results to display' : 'Enter a search query'}
            </p>
          )}
        </div>

        {/* Search Tips */}
        <div>
          <SectionHeader icon={SparklesIcon} title="Search Tips" />
          <ul className="space-y-2">
            <SearchTip>
              Use quotes for exact phrases: <code className="text-xs bg-interactive/60 px-1 rounded">&quot;day of judgment&quot;</code>
            </SearchTip>
            <SearchTip>
              Go to a verse: <code className="text-xs bg-interactive/60 px-1 rounded">2:255</code>
            </SearchTip>
            <SearchTip>
              Search by surah name: <code className="text-xs bg-interactive/60 px-1 rounded">Surah Yasin</code>
            </SearchTip>
            <SearchTip>
              Search works in Arabic and translations
            </SearchTip>
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
}

// Desktop version without mobile sidebar wrapper
export function SearchWorkspaceNavigation({
  query,
  verses,
  totalResults,
  isLoading,
}: SearchLeftSidebarProps): React.JSX.Element {
  return (
    <div className={cn('flex flex-1 flex-col bg-background text-foreground h-full')}>
      <SearchLeftSidebar
        query={query}
        verses={verses}
        totalResults={totalResults}
        isLoading={isLoading}
      />
    </div>
  );
}
