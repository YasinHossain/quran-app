'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { SidebarHeader } from '@/app/shared/components/SidebarHeader';
import { SearchIcon, BookOpenIcon, SparklesIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';
import { formatNumber, localizeDigits } from '@/lib/text/localizeNumbers';

import type { VerseWithHighlight } from '@/app/(features)/search/hooks/usePaginatedSearch';

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

const BreakdownItem = ({ surahNumber, count }: SurahBreakdown): React.JSX.Element => {
  const { t, i18n } = useTranslation();
  const formattedSurahNumber = formatNumber(surahNumber, i18n.language, { useGrouping: false });
  const fallbackSurahName = `${t('surah_tab')} ${formattedSurahNumber}`;
  const surahName = t(`surah_names.${surahNumber}`, fallbackSurahName);

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-interactive/40 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-6 h-6 flex items-center justify-center text-xs font-medium rounded bg-interactive/60 text-muted-foreground shrink-0">
          {formattedSurahNumber}
        </span>
        <span className="text-sm text-foreground truncate">{surahName}</span>
      </div>
      <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
        {formatNumber(count, i18n.language, { useGrouping: false })}
      </span>
    </div>
  );
};

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
  const { t, i18n } = useTranslation();

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
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [verses]);

  const hasResults = verses.length > 0;
  const showBreakdown = hasResults && surahBreakdown.length > 0;

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground h-full">
      {/* Mobile header with close button */}
      <SidebarHeader
        title={t('search_info_title')}
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
                <p className="text-sm font-medium text-foreground">{t('search_query_label')}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                  &quot;{query}&quot;
                </p>
              </div>
            </div>
            {!isLoading && (
              <div className="mt-3 pt-3 border-t border-accent/20">
                <p className="text-2xl font-bold text-accent">
                  {formatNumber(totalResults, i18n.language, { useGrouping: true })}
                </p>
                <p className="text-xs text-muted-foreground">{t('search_total_results_found')}</p>
              </div>
            )}
          </div>

          {/* Results Breakdown by Surah */}
          <div>
            <SectionHeader icon={BookOpenIcon} title={t('search_on_this_page')} />
            {isLoading ? (
              <LoadingSkeleton />
            ) : showBreakdown ? (
              <div className="space-y-1">
                {surahBreakdown.slice(0, 8).map((item) => (
                  <BreakdownItem key={item.surahNumber} {...item} />
                ))}
                {surahBreakdown.length > 8 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    {t('search_more_surahs', { count: surahBreakdown.length - 8 })}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {query.trim() ? t('search_no_results_to_display') : t('search_enter_query')}
              </p>
            )}
          </div>

          {/* Search Tips */}
          <div>
            <SectionHeader icon={SparklesIcon} title={t('search_tips_title')} />
            <ul className="space-y-2">
              <SearchTip>
                {t('search_tip_exact_phrases')}{' '}
                <code className="text-xs bg-interactive/60 px-1 rounded">
                  &quot;day of judgment&quot;
                </code>
              </SearchTip>
              <SearchTip>
                {t('search_tip_go_to_verse')}{' '}
                <code className="text-xs bg-interactive/60 px-1 rounded">
                  {localizeDigits('2:255', i18n.language)}
                </code>
              </SearchTip>
              <SearchTip>
                {t('search_tip_search_by_surah')}{' '}
                <code className="text-xs bg-interactive/60 px-1 rounded">
                  {t('surah_tab')} {t('surah_names.36', 'Yasin')}
                </code>
              </SearchTip>
              <SearchTip>{t('search_tip_supports_languages')}</SearchTip>
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
