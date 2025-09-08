'use client';

import React from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { SurahVerseList } from '@/app/(features)/surah/components/SurahVerseList';

import type { Verse } from '@/types';

interface SurahMainProps {
  verses: Verse[];
  isLoading: boolean;
  error: string | null;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isValidating: boolean;
  isReachingEnd: boolean;
}

export function SurahMain({
  verses,
  isLoading,
  error,
  loadMoreRef,
  isValidating,
  isReachingEnd,
}: SurahMainProps): React.JSX.Element {
  const { isHidden } = useHeaderVisibility();
  return (
    <main className="h-screen text-foreground font-sans lg:mr-[20.7rem] overflow-hidden">
      <div
        className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
          isHidden
            ? 'pt-0'
            : 'pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+env(safe-area-inset-top))]'
        }`}
      >
        <SurahVerseList
          verses={verses}
          isLoading={isLoading}
          error={error}
          loadMoreRef={loadMoreRef}
          isValidating={isValidating}
          isReachingEnd={isReachingEnd}
        />
      </div>
    </main>
  );
}
