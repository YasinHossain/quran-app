'use client';

import React from 'react';

import { SurahVerseList } from '@/app/(features)/surah/components/SurahVerseList';

import { SurahCalligraphyIntro } from './SurahCalligraphyIntro';
import { useVerseAudioWordSync } from './useVerseAudioWordSync';

import type { MushafResourceKind } from '@/app/(features)/surah/hooks/mushafReadingViewTypes';
import type { UseVerseListingReturn } from '@/app/(features)/surah/hooks/useVerseListing';

interface SurahMainProps {
  surahId?: number | undefined;
  verseListing: UseVerseListingReturn;
  resourceKind?: MushafResourceKind | undefined;
  emptyLabelKey?: string;
  endLabelKey?: string;
  initialVerseKey?: string | undefined;
  chapterId?: number | undefined;
}

export function SurahMain({
  surahId,
  verseListing,
  resourceKind,
  emptyLabelKey,
  endLabelKey,
  initialVerseKey,
  chapterId,
}: SurahMainProps): React.JSX.Element {
  const shouldRenderIntro = typeof chapterId === 'number' && chapterId > 0;

  useVerseAudioWordSync();

  return (
    <div className="w-full space-y-10">
      {shouldRenderIntro ? <SurahCalligraphyIntro chapterId={chapterId} /> : null}
      <SurahVerseList
        surahId={surahId}
        verseListing={verseListing}
        {...(resourceKind ? { resourceKind } : {})}
        {...(emptyLabelKey !== undefined ? { emptyLabelKey } : {})}
        {...(endLabelKey !== undefined ? { endLabelKey } : {})}
        {...(initialVerseKey ? { initialVerseKey } : {})}
      />
    </div>
  );
}
