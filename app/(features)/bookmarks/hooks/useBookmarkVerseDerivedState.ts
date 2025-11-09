import { useMemo } from 'react';

import { useSingleVerse } from '@/app/shared/hooks/useSingleVerse';

import {
  IdentifierSource,
  buildFallbackVerse,
  deriveBookmarkIdentifier,
  enrichBookmarkWithVerse,
  normalizeBookmarkWithIdentifier,
  resolveBookmarkVerseKey,
  sortChaptersById,
} from './utils/bookmarkVerse';

import type { Bookmark, Chapter, Verse } from '@/types';

export interface IdentifierState {
  verseIdentifier: string;
  identifierSource: IdentifierSource;
  derivedVerseKey: string | null;
  normalizedBookmark: Bookmark;
}

export interface VerseQueryState {
  verse: Verse | undefined;
  resolvedVerse: Verse | undefined;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;
}

export function useOrderedChapters(chapters: Chapter[]): Chapter[] {
  return useMemo(() => sortChaptersById(chapters), [chapters]);
}

export function useBookmarkIdentifierState(
  bookmark: Bookmark,
  chapters: Chapter[]
): IdentifierState {
  const identifiers = useMemo(() => deriveBookmarkIdentifier(bookmark), [bookmark]);

  const derivedVerseKey = useMemo(
    () =>
      resolveBookmarkVerseKey({
        bookmark,
        verseIdentifier: identifiers.verseIdentifier,
        chapters,
      }),
    [bookmark, chapters, identifiers.verseIdentifier]
  );

  const normalizedBookmark = useMemo(
    () =>
      normalizeBookmarkWithIdentifier({
        bookmark,
        verseIdentifier: identifiers.verseIdentifier,
        derivedVerseKey,
        identifierSource: identifiers.identifierSource,
      }),
    [bookmark, derivedVerseKey, identifiers.identifierSource, identifiers.verseIdentifier]
  );

  return { ...identifiers, derivedVerseKey, normalizedBookmark };
}

export function useResolvedVerseData(
  verseIdentifier: string,
  normalizedBookmark: Bookmark,
  derivedVerseKey: string | null
): VerseQueryState {
  const { verse, isLoading, error, mutate } = useSingleVerse({
    idOrKey: verseIdentifier,
  });

  const fallbackVerse = useMemo(
    () => buildFallbackVerse(normalizedBookmark, derivedVerseKey),
    [derivedVerseKey, normalizedBookmark]
  );

  return {
    verse,
    resolvedVerse: verse ?? fallbackVerse,
    isLoading,
    error,
    mutate,
  };
}

export function useEnrichedBookmarkMemo(params: {
  normalizedBookmark: Bookmark;
  resolvedVerse: Verse | undefined;
  chapters: Chapter[];
  fallbackTranslation?: string | null;
}): Bookmark {
  const { normalizedBookmark, resolvedVerse, chapters, fallbackTranslation } = params;
  return useMemo(
    () =>
      enrichBookmarkWithVerse({
        normalizedBookmark,
        resolvedVerse,
        chapters,
        fallbackTranslation,
      }),
    [chapters, fallbackTranslation, normalizedBookmark, resolvedVerse]
  );
}
