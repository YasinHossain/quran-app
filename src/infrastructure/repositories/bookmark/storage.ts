import { Bookmark } from '@/src/domain/entities';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';
import { StoredBookmark } from '@/src/domain/value-objects/StoredBookmark';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { isStoredBookmarkArray } from './bookmarkValidation';

const STORAGE_KEY = 'quran_bookmarks';

export function getStoredBookmarks(): StoredBookmark[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return isStoredBookmarkArray(parsed) ? parsed : [];
  } catch (error) {
    logger.error('Failed to parse stored bookmarks:', undefined, error as Error);
    return [];
  }
}

export function saveStoredBookmarks(bookmarks: StoredBookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    logger.error('Failed to save bookmarks:', undefined, error as Error);
  }
}

export function mapStoredToBookmark(stored: StoredBookmark): Bookmark {
  const position = new BookmarkPosition(
    stored.position.surahId,
    stored.position.ayahNumber,
    new Date(stored.position.timestamp)
  );

  return new Bookmark(
    stored.id,
    stored.userId,
    stored.verseId,
    position,
    new Date(stored.createdAt),
    stored.notes,
    stored.tags
  );
}
