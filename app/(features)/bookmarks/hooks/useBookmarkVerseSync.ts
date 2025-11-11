import { useEffect } from 'react';

import { IdentifierSource, buildIdentifierPatch, buildVerseDataPatch } from './utils/bookmarkVerse';

import type { Bookmark, Chapter, Verse } from '@/types';

export function useBookmarkIdentifierSync(params: {
  verseIdentifier: string;
  identifierSource: IdentifierSource;
  currentVerseId: string;
  currentVerseKey?: string;
  updateBookmark: (verseId: string, data: Partial<Bookmark>) => void;
}): void {
  const { verseIdentifier, identifierSource, currentVerseId, currentVerseKey, updateBookmark } =
    params;

  useEffect(() => {
    const updatePayload = buildIdentifierPatch({
      verseIdentifier,
      identifierSource,
      currentVerseId,
      ...(currentVerseKey !== undefined ? { currentVerseKey } : {}),
    });

    if (updatePayload) {
      updateBookmark(updatePayload.targetVerseId, updatePayload.patch);
    }
  }, [currentVerseId, currentVerseKey, identifierSource, updateBookmark, verseIdentifier]);
}

export function useBookmarkVerseContentSync(params: {
  verse: Verse | undefined;
  normalizedBookmark: Bookmark;
  chapters: Chapter[];
  updateBookmark: (verseId: string, data: Partial<Bookmark>) => void;
}): void {
  const { verse, normalizedBookmark, chapters, updateBookmark } = params;

  useEffect(() => {
    const updatePayload = buildVerseDataPatch({
      verse,
      normalizedBookmark,
      chapters,
    });

    if (updatePayload) {
      updateBookmark(updatePayload.targetVerseId, updatePayload.patch);
    }
  }, [chapters, normalizedBookmark, updateBookmark, verse]);
}
