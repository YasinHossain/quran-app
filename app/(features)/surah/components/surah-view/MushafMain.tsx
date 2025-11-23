'use client';

import { MushafPageList, LoadMoreSection } from './MushafPageList';
import { SurahCalligraphyIntro } from './SurahCalligraphyIntro';
import { useMushafMainState } from './useMushafMainState';

import type { MushafMainProps } from './MushafMain.types';
import type React from 'react';

export function MushafMain({
  pages,
  chapterId,
  isLoading,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  error,
  endLabelKey = 'end_of_surah',
  ...rest
}: MushafMainProps): React.JSX.Element {
  const state = useMushafMainState({
    pages,
    chapterId,
    isLoading,
    isLoadingMore,
    hasMore,
    onLoadMore,
    error,
    endLabelKey,
    ...rest,
  });

  return (
    <div className="w-full pb-20 pt-2">
      <div className="w-full space-y-10">
        {state.shouldRenderSurahIntro ? <SurahCalligraphyIntro chapterId={chapterId} /> : null}

        <MushafPageList
          pages={pages}
          settings={state.settings}
          mushafFlags={state.mushafFlags}
          getPageFontFamily={state.getPageFontFamily}
          isPageFontLoaded={state.isPageFontLoaded}
          isLoading={isLoading}
          error={error}
        />

        {state.shouldRenderLoadMore ? (
          <LoadMoreSection
            loadMoreRef={state.loadMoreRef}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            endLabel={state.endLabel}
            surahId={chapterId ?? undefined}
          />
        ) : null}
      </div>
    </div>
  );
}

export type { MushafMainProps };
