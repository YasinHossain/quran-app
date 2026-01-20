import { useCallback } from 'react';

import type { useBookmarkOperations } from './useBookmarkOperations';
import type { Bookmark } from '@/types';

/**
 * Check if a verseId matches a bookmark by comparing against multiple identifiers.
 * This handles cases where pins were created with different ID formats:
 * - Numeric API ID (e.g., "1" for verse 1:1)
 * - VerseKey format (e.g., "1:1")
 * - VerseApiId field
 */
const matchesBookmark = (bookmark: Bookmark, searchId: string): boolean => {
  const id = String(searchId);
  const bookmarkVerseId = String(bookmark.verseId);

  // Direct match on verseId
  if (bookmarkVerseId === id) return true;

  // Match on verseKey (handles both directions)
  if (bookmark.verseKey) {
    const verseKey = String(bookmark.verseKey);
    // searchId matches verseKey directly
    if (verseKey === id) return true;
    // bookmarkVerseId stored as verseKey format, searchId is numeric
    if (bookmarkVerseId === verseKey && bookmark.verseApiId) {
      if (String(bookmark.verseApiId) === id) return true;
    }
  }

  // Match on verseApiId if available
  if (bookmark.verseApiId && String(bookmark.verseApiId) === id) return true;

  // Handle case where bookmark.verseId is in verseKey format but searchId is numeric
  // by checking if searchId matches the verseApiId or if they share the same verseKey
  if (bookmarkVerseId.includes(':') && !id.includes(':')) {
    // bookmark was stored with verseKey as verseId
    // We can't reliably match numeric ID to verseKey without API lookup
    // But check verseApiId as fallback
    if (bookmark.verseApiId && String(bookmark.verseApiId) === id) return true;
  }

  return false;
};

export function usePinnedBookmarks(
  pinnedVerses: Bookmark[],
  bookmarkOps: ReturnType<typeof useBookmarkOperations>
): {
  togglePinned: (verseId: string, metadata?: Partial<Bookmark>) => void;
  isPinned: (verseId: string) => boolean;
} {
  const togglePinned = useCallback(
    (verseId: string, metadata?: Partial<Bookmark>) => {
      const alreadyPinned = pinnedVerses.some((b) => matchesBookmark(b, verseId));
      if (alreadyPinned) {
        // Find the actual bookmark to remove (might have different verseId format)
        const bookmark = pinnedVerses.find((b) => matchesBookmark(b, verseId));
        if (bookmark) {
          bookmarkOps.removeBookmark(bookmark.verseId, 'pinned');
        }
      } else {
        bookmarkOps.addBookmark(verseId, 'pinned', metadata);
      }
    },
    [pinnedVerses, bookmarkOps]
  );

  const isPinned = useCallback(
    (verseId: string) => pinnedVerses.some((b) => matchesBookmark(b, verseId)),
    [pinnedVerses]
  );

  return { togglePinned, isPinned } as const;
}
