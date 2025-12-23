'use client';

import { MushafPageList } from './MushafPageList';
import { SurahCalligraphyIntro } from './SurahCalligraphyIntro';
import { useMushafMainState } from './useMushafMainState';

import type { MushafMainProps } from './MushafMain.types';
import type React from 'react';

export function MushafMain({
  resourceId,
  resourceKind,
  initialPageNumber,
  initialVerseKey,
  chapterId,
  juzNumber,
  mushafId,
  reciterId,
  wordByWordLocale,
  translationIds,
  endLabelKey = 'end_of_surah',
  ...rest
}: MushafMainProps): React.JSX.Element {
  const state = useMushafMainState({
    resourceId,
    resourceKind,
    initialPageNumber,
    initialVerseKey,
    chapterId,
    juzNumber,
    mushafId,
    reciterId,
    wordByWordLocale,
    translationIds,
    endLabelKey,
    ...rest,
  });

  return (
    <div className="w-full pb-20 pt-0">
      <div className="w-full space-y-10">
        {state.shouldRenderSurahIntro ? (
          <div className="px-4 sm:px-6 lg:px-8">
            <SurahCalligraphyIntro chapterId={chapterId} />
          </div>
        ) : null}

        <MushafPageList
          resourceId={resourceId}
          resourceKind={resourceKind}
          mushafId={mushafId ?? 'qcf-madani-v1'}
          {...(typeof initialPageNumber === 'number' ? { initialPageNumber } : {})}
          {...(typeof initialVerseKey === 'string' ? { initialVerseKey } : {})}
          {...(typeof chapterId === 'number' ? { chapterId } : {})}
          {...(typeof juzNumber === 'number' ? { juzNumber } : {})}
          {...(typeof reciterId === 'number' ? { reciterId } : {})}
          {...(wordByWordLocale ? { wordByWordLocale } : {})}
          {...(translationIds ? { translationIds } : {})}
          settings={state.settings}
          mushafFlags={state.mushafFlags}
          endLabel={state.endLabel}
          {...(resourceKind === 'surah' && typeof chapterId === 'number'
            ? { surahId: chapterId }
            : {})}
        />
      </div>
    </div>
  );
}

export type { MushafMainProps };
