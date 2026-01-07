'use client';

import useSWRImmutable from 'swr/immutable';

import { getReadingViewPage } from '@infra/quran/readingViewClient';

import { mapVersesToPage } from './mushafReadingViewMapping';

import type { MushafPageLines } from '@/types';

type VerseRange = { from: string; to: string };

interface UseDedupedFetchMushafPageParams {
  pageNumber: number;
  mushafId: string;
  reciterId?: number | undefined;
  wordByWordLocale?: string | undefined;
  translationIds?: string | undefined;
  verseRange?: VerseRange | undefined;
  enabled?: boolean;
}

export function useDedupedFetchMushafPage({
  pageNumber,
  mushafId,
  reciterId,
  wordByWordLocale,
  translationIds,
  verseRange,
  enabled = true,
}: UseDedupedFetchMushafPageParams): {
  page: MushafPageLines | null;
  isLoading: boolean;
  error: string | null;
} {
  const requestKey = enabled
    ? [
        'mushaf-page',
        mushafId,
        pageNumber,
        typeof reciterId === 'number' ? reciterId : 'no-reciter',
        wordByWordLocale ?? 'no-wbw',
        translationIds ?? 'no-translations',
        verseRange?.from ?? 'no-from',
        verseRange?.to ?? 'no-to',
      ]
    : null;

  const { data, error, isLoading } = useSWRImmutable<MushafPageLines>(requestKey, async () => {
    const verses = await getReadingViewPage({
      pageNumber,
      mushafId,
      ...(typeof reciterId === 'number' ? { reciterId } : {}),
      ...(wordByWordLocale ? { wordByWordLocale } : {}),
      ...(translationIds ? { translationIds } : {}),
      ...(verseRange ? { from: verseRange.from, to: verseRange.to } : {}),
    });

    return mapVersesToPage(pageNumber, verses);
  });

  return {
    page: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  };
}
