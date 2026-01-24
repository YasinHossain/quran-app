'use client';

import { useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

import { ReaderShell } from '@/app/shared/reader';
import { useHashSearchParams } from '@/app/shared/navigation/useHashSearchParams';
import { getVersesByChapter } from '@/lib/api';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

import type { Verse } from '@/types';

interface SurahViewProps {
  surahId: string;
  initialVerseNumber?: number | undefined;
  initialVerses?: Verse[] | undefined;
  totalVerses?: number | undefined;
  initialVersesParams?: { translationIds: number[]; wordLang: string } | undefined;
}

/**
 * Main client component for displaying Surah verses with settings sidebar.
 * Manages verse listing, audio playback, and responsive layout with hidden header behavior.
 */
export function SurahView({
  surahId,
  initialVerseNumber,
  initialVerses,
  totalVerses,
  initialVersesParams,
}: SurahViewProps): React.JSX.Element {
  const searchParams = useSearchParams();
  const hashParams = useHashSearchParams();

  // Back-compat: older links may still use query params.
  const startVerseRaw =
    hashParams.get('startVerse') ?? searchParams?.get('startVerse') ?? undefined;
  const navSeq = hashParams.get('nav') ?? searchParams?.get('nav') ?? undefined;
  const viewParam = hashParams.get('view') ?? searchParams?.get('view') ?? undefined;

  const resolvedInitialVerseNumber = useMemo(() => {
    const fromQuery = startVerseRaw ? Number.parseInt(startVerseRaw, 10) : undefined;
    if (typeof fromQuery === 'number' && Number.isFinite(fromQuery) && fromQuery > 0) {
      return fromQuery;
    }
    if (typeof initialVerseNumber === 'number' && Number.isFinite(initialVerseNumber)) {
      return initialVerseNumber > 0 ? initialVerseNumber : undefined;
    }
    return undefined;
  }, [initialVerseNumber, startVerseRaw]);

  const initialVerseKey =
    typeof resolvedInitialVerseNumber === 'number'
      ? `${surahId}:${resolvedInitialVerseNumber}`
      : undefined;

  return (
    <ReaderShell
      resourceId={surahId}
      lookup={({ id, translationIds, page, perPage, wordLang, tajweed }) =>
        getVersesByChapter({
          id,
          translationIds,
          page,
          perPage,
          wordLang: ensureLanguageCode(wordLang),
          tajweed: tajweed ?? false,
        })
      }
      emptyLabelKey="no_verses_found"
      endLabelKey="end_of_surah"
      {...(typeof totalVerses === 'number' ? { totalVerses } : {})}
      {...(initialVerses ? { initialVerses } : {})}
      {...(initialVersesParams ? { initialVersesParams } : {})}
      {...(typeof resolvedInitialVerseNumber === 'number'
        ? { initialVerseNumber: resolvedInitialVerseNumber }
        : {})}
      {...(typeof initialVerseKey === 'string' ? { initialVerseKey } : {})}
      {...(typeof navSeq === 'string' ? { initialScrollNonce: navSeq } : {})}
      initialMode={viewParam === 'mushaf' ? 'mushaf' : 'verse'}
    />
  );
}
