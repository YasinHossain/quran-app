import { Bookmark } from '../../../domain/entities';
import { BookmarkPosition } from '../../../domain/value-objects/BookmarkPosition';
import { StoredBookmark, isStoredBookmark } from '../../../domain/value-objects/StoredBookmark';
import { logger } from '../../monitoring/Logger';

const STORAGE_KEY = 'quran_bookmarks';

function isStoredBookmarkArray(value: unknown): value is StoredBookmark[] {
  return Array.isArray(value) && value.every((item) => isStoredBookmark(item));
}

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
  return new Bookmark(
    stored.id,
    stored.userId,
    stored.verseId,
    new BookmarkPosition(
      stored.position.surahId,
      stored.position.ayahNumber,
      new Date(stored.position.timestamp)
    ),
    new Date(stored.createdAt),
    stored.notes,
    stored.tags || []
  );
}

export function mapBookmarkToStored(bookmark: Bookmark): StoredBookmark {
  return {
    id: bookmark.id,
    userId: bookmark.userId,
    verseId: bookmark.verseId,
    position: bookmark.position.toPlainObject(),
    createdAt: bookmark.createdAt.toISOString(),
    notes: bookmark.notes,
    tags: bookmark.tags,
  };
}

export { isStoredBookmarkArray };
