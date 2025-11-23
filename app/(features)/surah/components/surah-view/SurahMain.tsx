'use client';

import React from 'react';

import { SurahCalligraphyIntro } from './SurahCalligraphyIntro';
import { SurahVerseList } from '@/app/(features)/surah/components/SurahVerseList';

import type { Verse } from '@/types';

interface SurahMainProps {
  surahId?: number | undefined;
  verses: Verse[];
  isLoading: boolean;
  error: string | null;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  isReachingEnd: boolean;
  emptyLabelKey?: string;
  endLabelKey?: string;
  initialVerseKey?: string | undefined;
  chapterId?: number | undefined;
}

export function SurahMain({
  surahId,
  verses,
  isLoading,
  error,
  loadMoreRef,
  isValidating,
  isReachingEnd,
  emptyLabelKey,
  endLabelKey,
  initialVerseKey,
  chapterId,
}: SurahMainProps): React.JSX.Element {
  const shouldRenderIntro = typeof chapterId === 'number' && chapterId > 0;

  return (
    <div className="w-full space-y-10">
      {shouldRenderIntro ? <SurahCalligraphyIntro chapterId={chapterId} /> : null}
      <SurahVerseList
        surahId={surahId}
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
    </div>
  );
}
