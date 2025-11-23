'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { VerseListBody } from '@/app/(features)/surah/components/SurahVerseListContent';
import { useInitialVerseScroll } from '@/app/(features)/surah/hooks/useInitialVerseScroll';
import { useVerseListVirtualization } from '@/app/(features)/surah/hooks/useVerseListVirtualization';
import { Spinner } from '@/app/shared/Spinner';

import type { Verse as VerseType } from '@/types';

interface SurahVerseListProps {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  isReachingEnd: boolean;
  emptyLabelKey?: string;
  endLabelKey?: string;
  initialVerseKey?: string | undefined;
}

export const SurahVerseList = ({
  verses,
  isLoading,
  error,
  loadMoreRef,
  isValidating,
  isReachingEnd,
  emptyLabelKey = 'no_verses_found',
  endLabelKey = 'end_of_surah',
  initialVerseKey,
}: SurahVerseListProps): React.JSX.Element => {
  const { t } = useTranslation();
  const virtualization = useVerseListVirtualization({ verses, isLoading, error });

  useInitialVerseScroll({
    initialVerseKey,
    verses,
    shouldVirtualize: virtualization.shouldVirtualize,
    virtualizer: virtualization.virtualizer,
    containerRef: virtualization.containerRef,
    scrollParentRef: virtualization.scrollParentRef,
  });

  const emptyLabel = t(emptyLabelKey);
  const endLabel = t(endLabelKey);

  return (
    <div ref={virtualization.containerRef} className="w-full relative">
      <VerseListBody
        verses={verses}
        isLoading={isLoading}
        error={error}
        emptyLabel={emptyLabel}
        shouldVirtualize={virtualization.shouldVirtualize}
        virtualItems={virtualization.virtualItems}
        totalHeight={virtualization.virtualizer.getTotalSize()}
        measureElement={virtualization.virtualizer.measureElement}
      />
      <LoadMoreFooter
        loadMoreRef={loadMoreRef}
        isValidating={isValidating}
        isReachingEnd={isReachingEnd}
        endLabel={endLabel}
        hasVerses={verses.length > 0}
      />
    </div>
  );
};

interface LoadMoreFooterProps {
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  isReachingEnd: boolean;
  endLabel: string;
  hasVerses: boolean;
}

function LoadMoreFooter({
  loadMoreRef,
  isValidating,
  isReachingEnd,
  endLabel,
  hasVerses,
}: LoadMoreFooterProps): React.JSX.Element | null {
  if (!hasVerses) return null;

  return (
    <div ref={loadMoreRef} className="py-4 text-center space-x-2">
      {isValidating && <Spinner className="inline h-5 w-5 text-accent" />}
      {isReachingEnd && <span className="text-muted">{endLabel}</span>}
    </div>
  );
}
