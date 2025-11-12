import type { Bookmark, Verse } from '@/types';

const MISSING_REFERENCE_ERROR =
  'Bookmark is missing a valid verse reference. Please remove and re-create it.';

export function deriveBookmarkError(params: {
  resolvedVerse: Verse | undefined;
  verseIdentifier: string;
  normalizedBookmark: Bookmark;
  baseError: string | null;
}): string | null {
  const { resolvedVerse, verseIdentifier, normalizedBookmark, baseError } = params;
  if (resolvedVerse) {
    return null;
  }

  if (verseIdentifier || normalizedBookmark.verseKey) {
    return baseError;
  }

  return MISSING_REFERENCE_ERROR;
}

export function deriveBookmarkLoadingState(params: {
  resolvedVerse: Verse | undefined;
  verseIdentifier: string;
  isLoading: boolean;
}): boolean {
  const { resolvedVerse, verseIdentifier, isLoading } = params;
  if (resolvedVerse) {
    return false;
  }

  return Boolean(verseIdentifier) && Boolean(isLoading);
}
