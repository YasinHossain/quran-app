import { BookmarkUpdatePayload, parseNumericId } from './shared';

import type { Bookmark, Chapter } from '@/types';

const VERSE_ID_PATTERN = /^\d+$/;
const VERSE_KEY_PATTERN = /^\d+:\d+(?:-\d+)?$/;

export type IdentifierSource = 'verseId' | 'verseKey' | 'verseApiId' | null;

export function normaliseIdentifier(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const stringValue = String(value).trim();
  if (!stringValue) return null;
  if (VERSE_ID_PATTERN.test(stringValue) || VERSE_KEY_PATTERN.test(stringValue)) {
    return stringValue;
  }
  return null;
}

export function deriveBookmarkIdentifier(bookmark: Bookmark): {
  verseIdentifier: string;
  identifierSource: IdentifierSource;
} {
  const asId = normaliseIdentifier(bookmark.verseId);
  if (asId) {
    return { verseIdentifier: asId, identifierSource: 'verseId' };
  }

  const asKey = normaliseIdentifier(bookmark.verseKey);
  if (asKey) {
    return { verseIdentifier: asKey, identifierSource: 'verseKey' };
  }

  const asApiId = normaliseIdentifier(bookmark.verseApiId);
  if (asApiId) {
    return { verseIdentifier: asApiId, identifierSource: 'verseApiId' };
  }

  return { verseIdentifier: '', identifierSource: null };
}

export function resolveBookmarkVerseKey(params: {
  bookmark: Bookmark;
  verseIdentifier: string;
  chapters: Chapter[];
}): string | null {
  const { bookmark, verseIdentifier, chapters } = params;

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

export function normalizeBookmarkWithIdentifier(params: {
  bookmark: Bookmark;
  verseIdentifier: string;
  derivedVerseKey: string | null;
  identifierSource: IdentifierSource;
}): Bookmark {
  const { bookmark, verseIdentifier, derivedVerseKey, identifierSource } = params;
  if (!verseIdentifier) {
    return applyDerivedVerseKey(bookmark, derivedVerseKey);
  }

  if (bookmark.verseId === verseIdentifier) {
    return applyDerivedVerseKey(bookmark, derivedVerseKey);
  }

  return createBookmarkWithNormalizedId({
    bookmark,
    verseIdentifier,
    derivedVerseKey,
    identifierSource,
  });
}

export function buildIdentifierPatch(params: {
  verseIdentifier: string;
  identifierSource: IdentifierSource;
  currentVerseId: string;
  currentVerseKey?: string;
}): BookmarkUpdatePayload | null {
  const { verseIdentifier, identifierSource, currentVerseId, currentVerseKey } = params;
  if (!verseIdentifier || !currentVerseId || currentVerseId === verseIdentifier) {
    return null;
  }

  const patch: Partial<Bookmark> = { verseId: verseIdentifier };

  if (
    identifierSource === 'verseKey' &&
    (!currentVerseKey || normaliseIdentifier(currentVerseKey) !== verseIdentifier)
  ) {
    patch.verseKey = verseIdentifier;
  }

  return { targetVerseId: currentVerseId, patch };
}

function createBookmarkWithNormalizedId(params: {
  bookmark: Bookmark;
  verseIdentifier: string;
  derivedVerseKey: string | null;
  identifierSource: IdentifierSource;
}): Bookmark {
  const { bookmark, verseIdentifier, derivedVerseKey, identifierSource } = params;

  const baseBookmark: Bookmark = {
    ...bookmark,
    verseId: verseIdentifier,
  };

  if (shouldApplyDerivedKey(bookmark, derivedVerseKey)) {
    return {
      ...baseBookmark,
      verseKey: derivedVerseKey,
    };
  }

  if (shouldSyncVerseKey(identifierSource, bookmark.verseKey, verseIdentifier)) {
    return {
      ...baseBookmark,
      verseKey: verseIdentifier,
    };
  }

  return baseBookmark;
}

function applyDerivedVerseKey(bookmark: Bookmark, derivedVerseKey: string | null): Bookmark {
  if (shouldApplyDerivedKey(bookmark, derivedVerseKey)) {
    return { ...bookmark, verseKey: derivedVerseKey };
  }
  return bookmark;
}

function shouldApplyDerivedKey(
  bookmark: Bookmark,
  derivedVerseKey: string | null
): derivedVerseKey is string {
  return Boolean(derivedVerseKey && !bookmark.verseKey);
}

function shouldSyncVerseKey(
  identifierSource: IdentifierSource,
  bookmarkVerseKey: string | undefined,
  verseIdentifier: string
): boolean {
  return (
    identifierSource === 'verseKey' &&
    (!bookmarkVerseKey || normaliseIdentifier(bookmarkVerseKey) !== verseIdentifier)
  );
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
