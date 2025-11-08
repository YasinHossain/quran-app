'use client';

import React from 'react';

import { SurahVerseList } from '@/app/(features)/surah/components/SurahVerseList';

import type { Verse } from '@/types';

interface SurahMainProps {
  verses: Verse[];
  isLoading: boolean;
  error: string | null;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  isReachingEnd: boolean;
  emptyLabelKey?: string;
  endLabelKey?: string;
  initialVerseKey?: string;
}

export function SurahMain({
  verses,
  isLoading,
  error,
  loadMoreRef,
  isValidating,
  isReachingEnd,
  emptyLabelKey,
  endLabelKey,
  initialVerseKey,
}: SurahMainProps): React.JSX.Element {
  return (
    <SurahVerseList
      verses={verses}
      isLoading={isLoading}
      error={error}
      loadMoreRef={loadMoreRef}
      isValidating={isValidating}
      isReachingEnd={isReachingEnd}
      {...(emptyLabelKey !== undefined ? { emptyLabelKey } : {})}
      {...(endLabelKey !== undefined ? { endLabelKey } : {})}
      {...(initialVerseKey ? { initialVerseKey } : {})}
    />
  );
}
