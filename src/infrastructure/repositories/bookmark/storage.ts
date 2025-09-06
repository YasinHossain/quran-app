import { StoredBookmark } from '../../../domain/value-objects/StoredBookmark';
import { logger } from '../../monitoring/Logger';
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
