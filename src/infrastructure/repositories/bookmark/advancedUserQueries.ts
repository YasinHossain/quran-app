import { Bookmark, hasTag, hasNotes } from '../../../domain/entities';
import { BookmarkPosition } from '../../../domain/value-objects/BookmarkPosition';
import { getStoredBookmarks } from './storage';
import { findByUser } from './userQueries';
import { findBySurah } from './coreQueries';
export async function existsByUserAndVerse(userId: string, verseId: string): Promise<boolean> {
  return getStoredBookmarks().some((b) => b.userId === userId && b.verseId === verseId);
}

export async function existsAtPosition(
  userId: string,
  position: BookmarkPosition
): Promise<boolean> {
  return getStoredBookmarks().some(
    (b) =>
      b.userId === userId &&
      b.position.surahId === position.surahId &&
      b.position.ayahNumber === position.ayahNumber
  );
}

export async function findByTags(userId: string, tags: string[]): Promise<Bookmark[]> {
  const userBookmarks = await findByUser(userId);
  return userBookmarks.filter((bookmark) => tags.some((tag) => hasTag(bookmark, tag)));
}

export async function getTagsByUser(userId: string): Promise<string[]> {
  const userBookmarks = await findByUser(userId);
  const allTags = userBookmarks.flatMap((bookmark) => bookmark.tags);
  return [...new Set(allTags)].sort();
}

export async function findWithNotes(userId: string): Promise<Bookmark[]> {
  const userBookmarks = await findByUser(userId);
  return userBookmarks.filter((bookmark) => hasNotes(bookmark));
}

export async function findByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Bookmark[]> {
  const userBookmarks = await findByUser(userId);
  return userBookmarks.filter(
    (bookmark) => bookmark.createdAt >= startDate && bookmark.createdAt <= endDate
  );
}

export async function search(userId: string, query: string): Promise<Bookmark[]> {
  const userBookmarks = await findByUser(userId);
  const searchTerm = query.toLowerCase();

  return userBookmarks.filter(
    (bookmark) =>
      bookmark.notes?.toLowerCase().includes(searchTerm) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      bookmark.position.getDisplayText().toLowerCase().includes(searchTerm)
  );
}

export async function findNext(
  userId: string,
  currentPosition: BookmarkPosition
): Promise<Bookmark | null> {
  const userBookmarks = await findByUser(userId);

  const sorted = userBookmarks.sort((a, b) => {
    const surahCompare = a.position.surahId - b.position.surahId;
    if (surahCompare !== 0) return surahCompare;
    return a.position.ayahNumber - b.position.ayahNumber;
  });

  return (
    sorted.find(
      (bookmark) =>
        bookmark.position.surahId > currentPosition.surahId ||
        (bookmark.position.surahId === currentPosition.surahId &&
          bookmark.position.ayahNumber > currentPosition.ayahNumber)
    ) || null
  );
}

export async function findPrevious(
  userId: string,
  currentPosition: BookmarkPosition
): Promise<Bookmark | null> {
  const userBookmarks = await findByUser(userId);

  const sorted = userBookmarks.sort((a, b) => {
    const surahCompare = b.position.surahId - a.position.surahId;
    if (surahCompare !== 0) return surahCompare;
    return b.position.ayahNumber - a.position.ayahNumber;
  });

  return (
    sorted.find(
      (bookmark) =>
        bookmark.position.surahId < currentPosition.surahId ||
        (bookmark.position.surahId === currentPosition.surahId &&
          bookmark.position.ayahNumber < currentPosition.ayahNumber)
    ) || null
  );
}

export async function findNearPosition(
  userId: string,
  position: BookmarkPosition,
  radius: number
): Promise<Bookmark[]> {
  const surahBookmarks = await findBySurah(position.surahId);
  const userBookmarks = surahBookmarks.filter((b) => b.belongsToUser(userId));

  return userBookmarks.filter(
    (bookmark) => Math.abs(bookmark.position.ayahNumber - position.ayahNumber) <= radius
  );
}
