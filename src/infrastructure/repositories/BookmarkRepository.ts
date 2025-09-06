import { Bookmark } from '../../domain/entities/Bookmark';
import { IBookmarkRepository } from '../../domain/repositories/IBookmarkRepository';
import { BookmarkPosition } from '../../domain/value-objects/BookmarkPosition';
import { StoredBookmark } from '../../domain/value-objects/StoredBookmark';
import { logger } from '../monitoring/Logger';
import {
  getStoredBookmarks,
  saveStoredBookmarks,
  mapStoredToBookmark,
  mapBookmarkToStored,
  isStoredBookmarkArray,
} from './bookmark/storage';
import * as queries from './bookmark/queries';
export class BookmarkRepository implements IBookmarkRepository {
  async findById(id: string): Promise<Bookmark | null> {
    const stored = getStoredBookmarks();
    const bookmark = stored.find((b) => b.id === id);
    return bookmark ? mapStoredToBookmark(bookmark) : null;
  }
  async save(bookmark: Bookmark): Promise<void> {
    const stored = getStoredBookmarks();
    const index = stored.findIndex((b) => b.id === bookmark.id);
    const bookmarkData = mapBookmarkToStored(bookmark);
    if (index >= 0) {
      stored[index] = bookmarkData;
    } else {
      stored.push(bookmarkData);
    }
    saveStoredBookmarks(stored);
  }
  async remove(id: string): Promise<void> {
    const stored = getStoredBookmarks();
    const filtered = stored.filter((b) => b.id !== id);
    saveStoredBookmarks(filtered);
  }
  async exists(id: string): Promise<boolean> {
    const stored = getStoredBookmarks();
    return stored.some((b) => b.id === id);
  }
  async existsByUserAndVerse(userId: string, verseId: string): Promise<boolean> {
    return queries.existsByUserAndVerse(userId, verseId);
  }
  async findByUser(userId: string): Promise<Bookmark[]> {
    return queries.findByUser(userId);
  }
  async findByUserWithOptions(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      sortBy?: 'created' | 'position';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<Bookmark[]> {
    return queries.findByUserWithOptions(userId, options);
  }
  async findRecent(userId: string, limit: number = 10): Promise<Bookmark[]> {
    return queries.findRecent(userId, limit);
  }
  async findByVerse(verseId: string): Promise<Bookmark[]> {
    return queries.findByVerse(verseId);
  }
  async findBySurah(surahId: number): Promise<Bookmark[]> {
    return queries.findBySurah(surahId);
  }
  async findBySurahRange(surahId: number, fromAyah: number, toAyah: number): Promise<Bookmark[]> {
    return queries.findBySurahRange(surahId, fromAyah, toAyah);
  }
  async findByPosition(position: BookmarkPosition): Promise<Bookmark[]> {
    return queries.findByPosition(position);
  }
  async existsAtPosition(userId: string, position: BookmarkPosition): Promise<boolean> {
    return queries.existsAtPosition(userId, position);
  }
  async findByTags(userId: string, tags: string[]): Promise<Bookmark[]> {
    return queries.findByTags(userId, tags);
  }
  async getTagsByUser(userId: string): Promise<string[]> {
    return queries.getTagsByUser(userId);
  }
  async findWithNotes(userId: string): Promise<Bookmark[]> {
    return queries.findWithNotes(userId);
  }
  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Bookmark[]> {
    return queries.findByDateRange(userId, startDate, endDate);
  }
  async search(userId: string, query: string): Promise<Bookmark[]> {
    return queries.search(userId, query);
  }
  async findNext(userId: string, currentPosition: BookmarkPosition): Promise<Bookmark | null> {
    return queries.findNext(userId, currentPosition);
  }
  async findPrevious(userId: string, currentPosition: BookmarkPosition): Promise<Bookmark | null> {
    return queries.findPrevious(userId, currentPosition);
  }
  async findNearPosition(
    userId: string,
    position: BookmarkPosition,
    radius: number
  ): Promise<Bookmark[]> {
    return queries.findNearPosition(userId, position, radius);
  }
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
      bookmarksWithNotes: userBookmarks.filter((b) => b.hasNotes()).length,
    };
  }
  async exportBookmarks(userId: string): Promise<StoredBookmark[]> {
    return (await queries.findByUser(userId)).map((b) => mapBookmarkToStored(b));
  }
  async importBookmarks(userId: string, bookmarks: StoredBookmark[]): Promise<void> {
    if (!isStoredBookmarkArray(bookmarks)) {
      logger.warn('Invalid bookmark data for import');
      return;
    }
    for (const b of bookmarks) {
      const bookmark = new Bookmark(
        b.id || crypto.randomUUID(),
        userId,
        b.verseId,
        new BookmarkPosition(
          b.position.surahId,
          b.position.ayahNumber,
          new Date(b.position.timestamp)
        ),
        new Date(b.createdAt),
        b.notes,
        b.tags || []
      );
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
