import { StoredBookmark, isStoredBookmark } from '../../../domain/value-objects/StoredBookmark';

export function isStoredBookmarkArray(value: unknown): value is StoredBookmark[] {
  return Array.isArray(value) && value.every((item) => isStoredBookmark(item));
}

export function dedupe(bookmarks: StoredBookmark[]): StoredBookmark[] {
  const map = new Map<string, StoredBookmark>();
  for (const bookmark of bookmarks) {
    if (!map.has(bookmark.id)) {
      map.set(bookmark.id, bookmark);
    }
  }
  return Array.from(map.values());
}
