import { useEffect, useMemo } from 'react';

import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useSingleVerse } from '@/app/shared/hooks/useSingleVerse';

import type { Bookmark, Chapter, Verse } from '@/types';

const VERSE_ID_PATTERN = /^\d+$/;
const VERSE_KEY_PATTERN = /^\d+:\d+(?:-\d+)?$/;

type IdentifierSource = 'verseId' | 'verseKey' | 'verseApiId' | null;

function normaliseIdentifier(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const stringValue = String(value).trim();
  if (!stringValue) return null;
  if (VERSE_ID_PATTERN.test(stringValue) || VERSE_KEY_PATTERN.test(stringValue)) {
    return stringValue;
  }
  return null;
}

function findSurahNameFromKey(verseKey: string, chapters: Chapter[]): string {
  const [surahIdStr] = verseKey.split(':');
  const surahId = surahIdStr ? Number.parseInt(surahIdStr, 10) : NaN;
  if (!Number.isFinite(surahId)) {
    return `Surah ${surahIdStr || ''}`;
  }
  const chapter = chapters.find((c) => c.id === surahId);
  return chapter?.name_simple || `Surah ${surahIdStr}`;
}

function parseNumericId(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number.parseInt(String(value).trim(), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function inferVerseKeyFromSequentialId(
  verseNumber: number | null,
  chapters: Chapter[]
): string | null {
  if (!Number.isFinite(verseNumber) || verseNumber === null || verseNumber <= 0) {
    return null;
  }

  let remaining = verseNumber;
  for (const chapter of chapters) {
    if (!Number.isFinite(chapter.verses_count) || chapter.verses_count <= 0) continue;
    if (remaining <= chapter.verses_count) {
      return `${chapter.id}:${remaining}`;
    }
    remaining -= chapter.verses_count;
  }

  return null;
}

function resolveBookmarkVerseKey(
  bookmark: Bookmark,
  verseIdentifier: string,
  chapters: Chapter[]
): string | null {
  if (bookmark.verseKey && VERSE_KEY_PATTERN.test(bookmark.verseKey)) {
    return bookmark.verseKey;
  }

  if (verseIdentifier && VERSE_KEY_PATTERN.test(verseIdentifier)) {
    return verseIdentifier;
  }

  const apiIdKey = inferVerseKeyFromSequentialId(parseNumericId(bookmark.verseApiId), chapters);
  if (apiIdKey) return apiIdKey;

  const verseIdKey = inferVerseKeyFromSequentialId(parseNumericId(bookmark.verseId), chapters);
  if (verseIdKey) return verseIdKey;

  return null;
}

function fallbackIdFromVerseKey(verseKey: string): number | null {
  const [surahPart, ayahPartWithRange] = verseKey.split(':');
  const [ayahPart] = (ayahPartWithRange ?? '').split('-');
  const surahNumber = Number.parseInt(surahPart ?? '', 10);
  const ayahNumber = Number.parseInt(ayahPart ?? '', 10);
  if (Number.isFinite(surahNumber) && Number.isFinite(ayahNumber)) {
    return surahNumber * 1000 + ayahNumber;
  }
  return null;
}

function buildFallbackVerse(bookmark: Bookmark, verseKey: string | null): Verse | undefined {
  if (!verseKey) return undefined;
  const text = bookmark.verseText?.trim();
  if (!text) return undefined;

  const preferredId =
    (typeof bookmark.verseApiId === 'number' && Number.isFinite(bookmark.verseApiId)
      ? bookmark.verseApiId
      : null) ??
    parseNumericId(bookmark.verseId) ??
    fallbackIdFromVerseKey(verseKey) ??
    0;

  const translationText = bookmark.translation?.trim();

  return {
    id: preferredId > 0 ? preferredId : 0,
    verse_key: verseKey,
    text_uthmani: text,
    ...(translationText
      ? {
          translations: [
            {
              resource_id: bookmark.verseApiId ?? 0,
              text: translationText,
            },
          ],
        }
      : {}),
  };
}

interface UseBookmarkVerseReturn {
  bookmark: Bookmark;
  verse: Verse | undefined;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;
}

export function useBookmarkVerse(bookmark: Bookmark): UseBookmarkVerseReturn {
  const { chapters, updateBookmark } = useBookmarks();
  const orderedChapters = useMemo(() => [...chapters].sort((a, b) => a.id - b.id), [chapters]);
  const { verseIdentifier, identifierSource } = useMemo(() => {
    const asId = normaliseIdentifier(bookmark.verseId);
    if (asId) {
      return { verseIdentifier: asId, identifierSource: 'verseId' as IdentifierSource };
    }

    const asKey = normaliseIdentifier(bookmark.verseKey);
    if (asKey) {
      return { verseIdentifier: asKey, identifierSource: 'verseKey' as IdentifierSource };
    }

    const asApiId = normaliseIdentifier(bookmark.verseApiId);
    if (asApiId) {
      return { verseIdentifier: asApiId, identifierSource: 'verseApiId' as IdentifierSource };
    }

    return { verseIdentifier: '', identifierSource: null as IdentifierSource };
  }, [bookmark.verseApiId, bookmark.verseId, bookmark.verseKey]);

  const derivedVerseKey = useMemo(
    () => resolveBookmarkVerseKey(bookmark, verseIdentifier, orderedChapters),
    [bookmark, verseIdentifier, orderedChapters]
  );

  const normalizedBookmark = useMemo(() => {
    if (!verseIdentifier) {
      return derivedVerseKey && !bookmark.verseKey
        ? { ...bookmark, verseKey: derivedVerseKey }
        : bookmark;
    }

    if (bookmark.verseId === verseIdentifier) {
      return derivedVerseKey && !bookmark.verseKey
        ? { ...bookmark, verseKey: derivedVerseKey }
        : bookmark;
    }

    const withNormalizedId: Bookmark = {
      ...bookmark,
      verseId: verseIdentifier,
    };

    if (derivedVerseKey && !bookmark.verseKey) {
      withNormalizedId.verseKey = derivedVerseKey;
    } else if (
      identifierSource === 'verseKey' &&
      (!bookmark.verseKey || normaliseIdentifier(bookmark.verseKey) !== verseIdentifier)
    ) {
      withNormalizedId.verseKey = verseIdentifier;
    }

    return withNormalizedId;
  }, [bookmark, derivedVerseKey, verseIdentifier, identifierSource]);

  const { verse, isLoading, error, mutate } = useSingleVerse({
    idOrKey: verseIdentifier,
  });

  const fallbackVerse = useMemo(
    () => buildFallbackVerse(normalizedBookmark, derivedVerseKey),
    [normalizedBookmark, derivedVerseKey]
  );

  const resolvedVerse = verse ?? fallbackVerse;

  const enrichedBookmark = useMemo(() => {
    if (!resolvedVerse) {
      return normalizedBookmark;
    }

    const surahName = findSurahNameFromKey(resolvedVerse.verse_key, orderedChapters);
    const translationText =
      resolvedVerse.translations?.[0]?.text ??
      bookmark.translation ??
      normalizedBookmark.translation;

    return {
      ...normalizedBookmark,
      verseKey: resolvedVerse.verse_key,
      verseApiId: resolvedVerse.id,
      verseText: resolvedVerse.text_uthmani,
      surahName,
      ...(translationText ? { translation: translationText } : {}),
    };
  }, [normalizedBookmark, resolvedVerse, orderedChapters, bookmark.translation]);

  useEffect(() => {
    if (!verseIdentifier) return;

    const rawVerseId = bookmark.verseId;
    if (!rawVerseId || rawVerseId === verseIdentifier) {
      return;
    }

    const patch: Partial<Bookmark> = { verseId: verseIdentifier };

    if (
      identifierSource === 'verseKey' &&
      (!bookmark.verseKey || normaliseIdentifier(bookmark.verseKey) !== verseIdentifier)
    ) {
      patch.verseKey = verseIdentifier;
    }

    updateBookmark(rawVerseId, patch);
  }, [bookmark.verseId, bookmark.verseKey, identifierSource, updateBookmark, verseIdentifier]);

  useEffect(() => {
    if (!verse) return;

    const surahName = findSurahNameFromKey(verse.verse_key, orderedChapters);
    const translationText = verse.translations?.[0]?.text;

    const isUpToDate =
      normalizedBookmark.verseKey === verse.verse_key &&
      normalizedBookmark.verseApiId === verse.id &&
      normalizedBookmark.verseText === verse.text_uthmani &&
      normalizedBookmark.surahName === surahName &&
      (translationText === undefined || normalizedBookmark.translation === translationText);

    if (isUpToDate) return;

    updateBookmark(normalizedBookmark.verseId, {
      verseKey: verse.verse_key,
      verseApiId: verse.id,
      verseText: verse.text_uthmani,
      surahName,
      ...(translationText ? { translation: translationText } : {}),
    });
  }, [orderedChapters, normalizedBookmark, updateBookmark, verse]);

  const hasValidIdentifier = Boolean(verseIdentifier) || Boolean(normalizedBookmark.verseKey);
  const normalizedError = resolvedVerse
    ? null
    : hasValidIdentifier
      ? error
      : 'Bookmark is missing a valid verse reference. Please remove and re-create it.';

  return {
    bookmark: enrichedBookmark,
    verse: resolvedVerse,
    isLoading: resolvedVerse ? false : Boolean(verseIdentifier) && Boolean(isLoading),
    error: normalizedError,
    mutate,
  };
}
