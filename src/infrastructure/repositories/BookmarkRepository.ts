import { Bookmark, hasNotes } from '@/src/domain/entities';
import { IBookmarkRepository } from '@/src/domain/repositories/IBookmarkRepository';
import { StoredBookmark } from '@/src/domain/value-objects/StoredBookmark';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { toDomain, toPersistence } from './bookmark/bookmarkMapper';
import { isStoredBookmarkArray, dedupe } from './bookmark/bookmarkValidation';
import * as queries from './bookmark/queries';
import { getStoredBookmarks, saveStoredBookmarks } from './bookmark/storage';

export class BookmarkRepository implements IBookmarkRepository {
  async findById(id: string): Promise<Bookmark | null> {
    const stored = getStoredBookmarks();
    const bookmark = stored.find((b) => b.id === id);
    return bookmark ? toDomain(bookmark) : null;
  }

  async save(bookmark: Bookmark): Promise<void> {
    const stored = getStoredBookmarks();
    const index = stored.findIndex((b) => b.id === bookmark.id);
    const bookmarkData = toPersistence(bookmark);
    if (index >= 0) stored[index] = bookmarkData;
    else stored.push(bookmarkData);
    saveStoredBookmarks(stored);
  }

  async remove(id: string): Promise<void> {
    saveStoredBookmarks(getStoredBookmarks().filter((b) => b.id !== id));
  }

  async exists(id: string): Promise<boolean> {
    return getStoredBookmarks().some((b) => b.id === id);
  }

  existsByUserAndVerse = queries.existsByUserAndVerse;
  findByUser = queries.findByUser;
  findByUserWithOptions = queries.findByUserWithOptions;
  findRecent = queries.findRecent;
  findByVerse = queries.findByVerse;
  findBySurah = queries.findBySurah;
  findBySurahRange = queries.findBySurahRange;
  findByPosition = queries.findByPosition;
  existsAtPosition = queries.existsAtPosition;
  findByTags = queries.findByTags;
  getTagsByUser = queries.getTagsByUser;
  findWithNotes = queries.findWithNotes;
  findByDateRange = queries.findByDateRange;
  search = queries.search;
  findNext = queries.findNext;
  findPrevious = queries.findPrevious;
  findNearPosition = queries.findNearPosition;

  async saveMany(bookmarks: Bookmark[]): Promise<void> {
    for (const bookmark of bookmarks) await this.save(bookmark);
  }

  async removeMany(ids: string[]): Promise<void> {
    for (const id of ids) await this.remove(id);
  }

  async removeAllByUser(userId: string): Promise<void> {
    saveStoredBookmarks(getStoredBookmarks().filter((b) => b.userId !== userId));
  }

  async removeBySurah(userId: string, surahId: number): Promise<void> {
    saveStoredBookmarks(
      getStoredBookmarks().filter((b) => !(b.userId === userId && b.position.surahId === surahId))
    );
  }

  async getCountByUser(userId: string): Promise<number> {
    return (await queries.findByUser(userId)).length;
  }

  async getCountBySurah(userId: string, surahId: number): Promise<number> {
    return (await queries.findBySurah(surahId)).filter((b) => b.belongsToUser(userId)).length;
  }

  async getStatistics(userId: string): Promise<{
    totalBookmarks: number;
    surahsCovered: number;
    mostBookmarkedSurah: { surahId: number; count: number } | null;
    tagsUsed: number;
    bookmarksWithNotes: number;
  }> {
    const userBookmarks = await queries.findByUser(userId);
    const surahCounts: Record<number, number> = {};
    userBookmarks.forEach((b) => {
      surahCounts[b.position.surahId] = (surahCounts[b.position.surahId] || 0) + 1;
    });
    let mostBookmarkedSurah: { surahId: number; count: number } | null = null;
    for (const [surahId, count] of Object.entries(surahCounts)) {
      if (!mostBookmarkedSurah || count > mostBookmarkedSurah.count) {
        mostBookmarkedSurah = { surahId: parseInt(surahId), count };
      }
    }
    const allTags = userBookmarks.flatMap((b) => b.tags);
    const uniqueTags = new Set(allTags);
    return {
      totalBookmarks: userBookmarks.length,
      surahsCovered: Object.keys(surahCounts).length,
      mostBookmarkedSurah,
      tagsUsed: uniqueTags.size,
      bookmarksWithNotes: userBookmarks.filter((b) => hasNotes(b)).length,
    };
  }

  async exportBookmarks(userId: string): Promise<StoredBookmark[]> {
    return (await queries.findByUser(userId)).map((b) => toPersistence(b));
  }

  async importBookmarks(userId: string, bookmarks: StoredBookmark[]): Promise<void> {
    if (!isStoredBookmarkArray(bookmarks)) {
      logger.warn('Invalid bookmark data for import');
      return;
    }
    for (const b of dedupe(bookmarks)) {
      const bookmark = toDomain({ ...b, id: b.id || crypto.randomUUID(), userId });
      await this.save(bookmark);
    }
  }

  async cacheForOffline(userId: string): Promise<void> {
    logger.info('Bookmarks already cached offline', { userId });
  }

  async clearCache(userId: string): Promise<void> {
    await this.removeAllByUser(userId);
  }
}
