'use client';

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { VerseCard } from '../../molecules/cards/VerseCard';
import { LoadingCard } from '../../molecules/cards/LoadingCard';
import { ErrorCard } from '../../molecules/cards/ErrorCard';
import type { Verse } from '@/src/domain/entities/Verse';

export interface VerseListProps {
  verses: Verse[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  enableTajweed?: boolean;
  arabicFontSize?: number;
  translationFontSize?: number;
  fontFamily?: string;
  emptyMessage?: string;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
  isValidating?: boolean;
  isReachingEnd?: boolean;
  endMessage?: string;
  renderVerse?: (verse: Verse, index: number) => ReactNode;
}

export const VerseList = forwardRef<HTMLDivElement, VerseListProps>(
  (
    {
      verses,
      isLoading = false,
      error = null,
      className,
      enableTajweed = false,
      arabicFontSize = 24,
      translationFontSize = 16,
      fontFamily,
      emptyMessage = 'No verses found',
      loadMoreRef,
      isValidating = false,
      isReachingEnd = false,
      endMessage = 'End of surah',
      renderVerse,
    },
    ref
  ) => {
    if (isLoading && verses.length === 0) {
      return <LoadingCard message="Loading verses..." />;
    }

    if (error) {
      return <ErrorCard message={error} />;
    }

    if (verses.length === 0) {
      return <div className="text-center py-20 text-muted">{emptyMessage}</div>;
    }

    return (
      <div ref={ref} className={cn('w-full relative', className)}>
        {verses.map((verse, index) =>
          renderVerse ? (
            <div key={verse.id}>{renderVerse(verse, index)}</div>
          ) : (
            <VerseCard
              key={verse.id}
              verse={verse}
              enableTajweed={enableTajweed}
              arabicFontSize={arabicFontSize}
              translationFontSize={translationFontSize}
              fontFamily={fontFamily}
            />
          )
        )}

        {/* Load more indicator */}
        {loadMoreRef && (
          <div ref={loadMoreRef} className="py-4 text-center space-x-2">
            {isValidating && <LoadingCard message="Loading more verses..." className="py-4" />}
            {isReachingEnd && <span className="text-muted text-sm">{endMessage}</span>}
          </div>
        )}
      </div>
    );
  }
);

VerseList.displayName = 'VerseList';
