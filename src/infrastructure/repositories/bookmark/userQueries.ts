import { getStoredBookmarks, mapStoredToBookmark } from './storage';
import { Bookmark } from '../../../domain/entities';

export async function findByUser(userId: string): Promise<Bookmark[]> {
  const stored = getStoredBookmarks();
  return stored
    .filter((b) => b.userId === userId)
    .map((b) => mapStoredToBookmark(b))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function findByUserWithOptions(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'created' | 'position';
    sortOrder?: 'asc' | 'desc';
  }
): Promise<Bookmark[]> {
  let bookmarks = await findByUser(userId);

  if (options?.sortBy === 'position') {
    bookmarks = bookmarks.sort((a, b) => {
      const positionCompare =
        a.position.surahId - b.position.surahId || a.position.ayahNumber - b.position.ayahNumber;
      return options.sortOrder === 'desc' ? -positionCompare : positionCompare;
    });
  } else {
    bookmarks = bookmarks.sort((a, b) => {
      const timeCompare = a.createdAt.getTime() - b.createdAt.getTime();
      return options?.sortOrder === 'desc' ? -timeCompare : timeCompare;
    });
  }

  const start = options?.offset || 0;
  const end = options?.limit ? start + options.limit : undefined;
  return bookmarks.slice(start, end);
}

export async function findRecent(userId: string, limit = 10): Promise<Bookmark[]> {
  return (await findByUser(userId)).slice(0, limit);
}
