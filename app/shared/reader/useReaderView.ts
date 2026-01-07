'use client';

import { useMemo } from 'react';

import { useSurahPanels, useVerseListing } from '@/app/(features)/surah/hooks';
import { type MushafResourceKind } from '@/app/(features)/surah/hooks/mushafReadingViewTypes';
import { MUSHAF_OPTIONS } from '@/data/mushaf/options';

import type { UseVerseListingParams } from '@/app/(features)/surah/hooks/useVerseListing';

type UseReaderViewReturn = {
  verseListing: ReturnType<typeof useVerseListing>;
  panels: ReturnType<typeof useSurahPanels>;
  mushafParams: {
    initialPageNumber?: number | undefined;
    chapterId?: number | undefined;
    juzNumber?: number | undefined;
    reciterId?: number | undefined;
    wordByWordLocale?: string | undefined;
    translationIds?: string | undefined;
  };
};

interface UseReaderViewParams {
  resourceId: string;
  resourceKind: MushafResourceKind;
  lookup: UseVerseListingParams['lookup'];
  initialVerses?: UseVerseListingParams['initialVerses'];
  totalVerses?: UseVerseListingParams['totalVerses'];
  initialVersesParams?: UseVerseListingParams['initialVersesParams'];
  initialVerseNumber?: number | undefined;
}

const toNumberOrUndefined = (value: unknown): number | undefined => {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const resolveTranslationIdsParam = (
  primaryId: number | undefined,
  ids?: number[]
): string | undefined => {
  const source = ids?.length ? ids : typeof primaryId === 'number' ? [primaryId] : [];
  const filtered = source.filter((id) => typeof id === 'number' && Number.isFinite(id));
  return filtered.length ? filtered.join(',') : undefined;
};

export const useReaderView = ({
  resourceId,
  resourceKind,
  lookup,
  initialVerses,
  totalVerses,
  initialVersesParams,
  initialVerseNumber,
}: UseReaderViewParams): UseReaderViewReturn => {
  const verseListing = useVerseListing({
    id: resourceId,
    resourceKind,
    ...(typeof totalVerses === 'number' ? { totalVerses } : {}),
    ...(initialVersesParams ? { initialVersesParams } : {}),
    lookup,
    ...(initialVerses ? { initialVerses } : {}),
    ...(typeof initialVerseNumber === 'number' ? { initialVerseNumber } : {}),
  });

  const panels = useSurahPanels({
    translationOptions: verseListing.translationOptions,
    wordLanguageOptions: verseListing.wordLanguageOptions,
    settings: verseListing.settings,
    setSettings: verseListing.setSettings,
    mushafOptions: MUSHAF_OPTIONS,
  });

  const firstLoadedVerse = verseListing.verses[0];
  const initialVerseFallback = initialVerses?.[0];

  const initialMushafPageNumber = useMemo(() => {
    const raw =
      firstLoadedVerse?.page_number ??
      initialVerseFallback?.page_number ??
      (resourceKind === 'page' ? Number.parseInt(resourceId, 10) : undefined);
    return typeof raw === 'number' && Number.isFinite(raw) ? raw : undefined;
  }, [firstLoadedVerse, initialVerseFallback, resourceKind, resourceId]);

  const mushafChapterId = useMemo(() => {
    if (resourceKind === 'surah') {
      return toNumberOrUndefined(resourceId);
    }
    return toNumberOrUndefined(firstLoadedVerse?.chapter_id ?? initialVerseFallback?.chapter_id);
  }, [resourceKind, resourceId, firstLoadedVerse, initialVerseFallback]);

  const mushafJuzNumber = useMemo(() => {
    if (resourceKind === 'juz') {
      return toNumberOrUndefined(resourceId);
    }
    return undefined;
  }, [resourceKind, resourceId]);

  const translationIdsParam = resolveTranslationIdsParam(
    verseListing.settings.translationId,
    verseListing.settings.translationIds
  );

  return {
    verseListing,
    panels,
    mushafParams: {
      ...(typeof initialMushafPageNumber === 'number'
        ? { initialPageNumber: initialMushafPageNumber }
        : {}),
      ...(typeof mushafChapterId === 'number' ? { chapterId: mushafChapterId } : {}),
      ...(typeof mushafJuzNumber === 'number' ? { juzNumber: mushafJuzNumber } : {}),
      ...(typeof verseListing.reciter?.id === 'number'
        ? { reciterId: verseListing.reciter.id }
        : {}),
      wordByWordLocale: verseListing.settings.wordLang,
      ...(translationIdsParam ? { translationIds: translationIdsParam } : {}),
    },
  };
};
