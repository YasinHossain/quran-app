'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { ReaderShell } from '@/app/shared/reader';
import { getVersesByChapter } from '@/lib/api';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

interface SurahViewProps {
  surahId: string;
  initialVerseNumber?: number | undefined;
}

/**
 * Main client component for displaying Surah verses with settings sidebar.
 * Manages verse listing, audio playback, and responsive layout with hidden header behavior.
 */
export function SurahView({ surahId, initialVerseNumber }: SurahViewProps): React.JSX.Element {
  const searchParams = useSearchParams();
  const queryStartVerseRaw = searchParams?.get('startVerse');
  const navSeq = searchParams?.get('nav') ?? undefined;

  const resolvedInitialVerseNumber = useMemo(() => {
    const fromQuery = queryStartVerseRaw ? Number.parseInt(queryStartVerseRaw, 10) : undefined;
    if (typeof fromQuery === 'number' && Number.isFinite(fromQuery) && fromQuery > 0) {
      return fromQuery;
    }
    if (typeof initialVerseNumber === 'number' && Number.isFinite(initialVerseNumber)) {
      return initialVerseNumber > 0 ? initialVerseNumber : undefined;
    }
    return undefined;
  }, [initialVerseNumber, queryStartVerseRaw]);

  const initialVerseKey =
    typeof resolvedInitialVerseNumber === 'number'
      ? `${surahId}:${resolvedInitialVerseNumber}`
      : undefined;

  return (
    <ReaderShell
      resourceId={surahId}
      lookup={({ id, translationIds, page, perPage, wordLang }) =>
        getVersesByChapter({
          id,
          translationIds,
          page,
          perPage,
          wordLang: ensureLanguageCode(wordLang),
        })
      }
      emptyLabelKey="no_verses_found"
      endLabelKey="end_of_surah"
      {...(typeof resolvedInitialVerseNumber === 'number'
        ? { initialVerseNumber: resolvedInitialVerseNumber }
        : {})}
      {...(typeof initialVerseKey === 'string' ? { initialVerseKey } : {})}
      {...(typeof navSeq === 'string' ? { initialScrollNonce: navSeq } : {})}
    />
  );
}
