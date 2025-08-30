'use client';

import { ReactNode, useRef } from 'react';
import { useIntersectionObserver } from '@/src/presentation/hooks/ui/useIntersectionObserver';
import { VerseList } from '../lists/VerseList';
import { useVerseListingWithDomain } from '@/src/presentation/hooks/domain/useVerseListingWithDomain';

interface SurahReadingLayoutProps {
  surahId: number;
  enabledTranslations: string[];
  enabledTafsirs: string[];
  enableTajweed: boolean;
  arabicFontSize: number;
  translationFontSize: number;
  fontFamily: string;
  children?: ReactNode;
}

export const SurahReadingLayout = ({
  surahId,
  enabledTranslations,
  enabledTafsirs,
  enableTajweed,
  arabicFontSize,
  translationFontSize,
  fontFamily,
  children,
}: SurahReadingLayoutProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { verses, isLoading, error, hasNextPage, isLoadingMore, loadMore } =
    useVerseListingWithDomain({
      surahId,
      pageSize: 10,
      enabledTranslations,
      enabledTafsirs,
    });

  // Load more when intersection observer triggers
  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: loadMore,
    enabled: hasNextPage && !isLoadingMore,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-background">
      {children}

      <main className="container mx-auto px-4 py-6">
        <VerseList
          verses={verses}
          isLoading={isLoading}
          error={error}
          enableTajweed={enableTajweed}
          arabicFontSize={arabicFontSize}
          translationFontSize={translationFontSize}
          fontFamily={fontFamily}
          loadMoreRef={loadMoreRef}
          isValidating={isLoadingMore}
          isReachingEnd={!hasNextPage}
          endMessage="End of Surah"
        />
      </main>
    </div>
  );
};
