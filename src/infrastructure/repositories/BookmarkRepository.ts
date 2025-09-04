import { IBookmarkRepository } from '../../domain/repositories/IBookmarkRepository';
import { Bookmark } from '../../domain/entities/Bookmark';
import { BookmarkPosition } from '../../domain/value-objects/BookmarkPosition';
import { StoredBookmark, isStoredBookmark } from '../../domain/value-objects/StoredBookmark';
import { logger } from '../monitoring/Logger';

/**
 * Infrastructure implementation of bookmark repository using localStorage
 * In production, this would connect to a database or API
 */
export class BookmarkRepository implements IBookmarkRepository {
  private readonly storageKey = 'quran_bookmarks';

  private isStoredBookmarkArray(value: unknown): value is StoredBookmark[] {
    return Array.isArray(value) && value.every((item) => isStoredBookmark(item));
  }

  private getStoredBookmarks(): StoredBookmark[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      return this.isStoredBookmarkArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse stored bookmarks:', error);
      return [];
    }
  }

  private saveStoredBookmarks(bookmarks: StoredBookmark[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }

  private mapStoredToBookmark(stored: StoredBookmark): Bookmark {
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

  private mapBookmarkToStored(bookmark: Bookmark): StoredBookmark {
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

  async findById(id: string): Promise<Bookmark | null> {
    const stored = this.getStoredBookmarks();
    const bookmark = stored.find((b) => b.id === id);
    return bookmark ? this.mapStoredToBookmark(bookmark) : null;
  }

  async save(bookmark: Bookmark): Promise<void> {
    const stored = this.getStoredBookmarks();
    const index = stored.findIndex((b) => b.id === bookmark.id);
    const bookmarkData = this.mapBookmarkToStored(bookmark);

    if (index >= 0) {
      stored[index] = bookmarkData;
    } else {
      stored.push(bookmarkData);
    }

    this.saveStoredBookmarks(stored);
  }

  async remove(id: string): Promise<void> {
    const stored = this.getStoredBookmarks();
    const filtered = stored.filter((b) => b.id !== id);
    this.saveStoredBookmarks(filtered);
  }

  async exists(id: string): Promise<boolean> {
    const stored = this.getStoredBookmarks();
    return stored.some((b) => b.id === id);
  }

  async existsByUserAndVerse(userId: string, verseId: string): Promise<boolean> {
    const stored = this.getStoredBookmarks();
    return stored.some((b) => b.userId === userId && b.verseId === verseId);
  }

  async findByUser(userId: string): Promise<Bookmark[]> {
    const stored = this.getStoredBookmarks();
    return stored
      .filter((b) => b.userId === userId)
      .map((b) => this.mapStoredToBookmark(b))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
    let bookmarks = await this.findByUser(userId);

    // Apply sorting
    if (options?.sortBy === 'position') {
      bookmarks = bookmarks.sort((a, b) => {
        const positionCompare =
          a.position.surahId - b.position.surahId || a.position.ayahNumber - b.position.ayahNumber;
        return options.sortOrder === 'desc' ? -positionCompare : positionCompare;
      });
    } else {
      // Default to created date
      bookmarks = bookmarks.sort((a, b) => {
        const timeCompare = a.createdAt.getTime() - b.createdAt.getTime();
        return options?.sortOrder === 'desc' ? -timeCompare : timeCompare;
      });
    }

    // Apply pagination
    const start = options?.offset || 0;
    const end = options?.limit ? start + options.limit : undefined;

    return bookmarks.slice(start, end);
  }

  async findRecent(userId: string, limit: number = 10): Promise<Bookmark[]> {
    return this.findByUserWithOptions(userId, {
      limit,
      sortBy: 'created',
      sortOrder: 'desc',
    });
  }

  async findByVerse(verseId: string): Promise<Bookmark[]> {
    const stored = this.getStoredBookmarks();
    return stored.filter((b) => b.verseId === verseId).map((b) => this.mapStoredToBookmark(b));
  }

  async findBySurah(surahId: number): Promise<Bookmark[]> {
    const stored = this.getStoredBookmarks();
    return stored
      .filter((b) => b.position.surahId === surahId)
      .map((b) => this.mapStoredToBookmark(b))
      .sort((a, b) => a.position.ayahNumber - b.position.ayahNumber);
  }

  async findBySurahRange(surahId: number, fromAyah: number, toAyah: number): Promise<Bookmark[]> {
    const surahBookmarks = await this.findBySurah(surahId);
    return surahBookmarks.filter(
      (b) => b.position.ayahNumber >= fromAyah && b.position.ayahNumber <= toAyah
    );
  }

  async findByPosition(position: BookmarkPosition): Promise<Bookmark[]> {
    const stored = this.getStoredBookmarks();
    return stored
      .filter(
        (b) =>
          b.position.surahId === position.surahId && b.position.ayahNumber === position.ayahNumber
      )
      .map((b) => this.mapStoredToBookmark(b));
  }

  async existsAtPosition(userId: string, position: BookmarkPosition): Promise<boolean> {
    const stored = this.getStoredBookmarks();
    return stored.some(
      (b) =>
        b.userId === userId &&
        b.position.surahId === position.surahId &&
        b.position.ayahNumber === position.ayahNumber
    );
  }

  async findByTags(userId: string, tags: string[]): Promise<Bookmark[]> {
    const userBookmarks = await this.findByUser(userId);
    return userBookmarks.filter((bookmark) => tags.some((tag) => bookmark.hasTag(tag)));
  }

  async getTagsByUser(userId: string): Promise<string[]> {
    const userBookmarks = await this.findByUser(userId);
    const allTags = userBookmarks.flatMap((bookmark) => bookmark.tags);
    return [...new Set(allTags)].sort();
  }

  async findWithNotes(userId: string): Promise<Bookmark[]> {
    const userBookmarks = await this.findByUser(userId);
    return userBookmarks.filter((bookmark) => bookmark.hasNotes());
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Bookmark[]> {
    const userBookmarks = await this.findByUser(userId);
    return userBookmarks.filter(
      (bookmark) => bookmark.createdAt >= startDate && bookmark.createdAt <= endDate
    );
  }

  async search(userId: string, query: string): Promise<Bookmark[]> {
    const userBookmarks = await this.findByUser(userId);
    const searchTerm = query.toLowerCase();

    return userBookmarks.filter(
      (bookmark) =>
        bookmark.notes?.toLowerCase().includes(searchTerm) ||
        bookmark.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        bookmark.position.getDisplayText().toLowerCase().includes(searchTerm)
    );
  }

  async findNext(userId: string, currentPosition: BookmarkPosition): Promise<Bookmark | null> {
    const userBookmarks = await this.findByUser(userId);

    // Sort by position
    const sorted = userBookmarks.sort((a, b) => {
      const surahCompare = a.position.surahId - b.position.surahId;
      if (surahCompare !== 0) return surahCompare;
      return a.position.ayahNumber - b.position.ayahNumber;
    });

    // Find next bookmark after current position
    return (
      sorted.find(
        (bookmark) =>
          bookmark.position.surahId > currentPosition.surahId ||
          (bookmark.position.surahId === currentPosition.surahId &&
            bookmark.position.ayahNumber > currentPosition.ayahNumber)
      ) || null
    );
  }

  async findPrevious(userId: string, currentPosition: BookmarkPosition): Promise<Bookmark | null> {
    const userBookmarks = await this.findByUser(userId);

    // Sort by position in reverse
    const sorted = userBookmarks.sort((a, b) => {
      const surahCompare = b.position.surahId - a.position.surahId;
      if (surahCompare !== 0) return surahCompare;
      return b.position.ayahNumber - a.position.ayahNumber;
    });

    // Find previous bookmark before current position
    return (
      sorted.find(
        (bookmark) =>
          bookmark.position.surahId < currentPosition.surahId ||
          (bookmark.position.surahId === currentPosition.surahId &&
            bookmark.position.ayahNumber < currentPosition.ayahNumber)
      ) || null
    );
  }

  async findNearPosition(
    userId: string,
    position: BookmarkPosition,
    radius: number
  ): Promise<Bookmark[]> {
    const surahBookmarks = await this.findBySurah(position.surahId);
    const userBookmarks = surahBookmarks.filter((b) => b.belongsToUser(userId));

    return userBookmarks.filter(
      (bookmark) => Math.abs(bookmark.position.ayahNumber - position.ayahNumber) <= radius
    );
  }

  async saveMany(bookmarks: Bookmark[]): Promise<void> {
    for (const bookmark of bookmarks) {
      await this.save(bookmark);
    }
  }

  async removeMany(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.remove(id);
    }
  }

  async removeAllByUser(userId: string): Promise<void> {
    const stored = this.getStoredBookmarks();
    const filtered = stored.filter((b) => b.userId !== userId);
    this.saveStoredBookmarks(filtered);
  }

  async removeBySurah(userId: string, surahId: number): Promise<void> {
    const stored = this.getStoredBookmarks();
    const filtered = stored.filter((b) => !(b.userId === userId && b.position.surahId === surahId));
    this.saveStoredBookmarks(filtered);
  }

  async getCountByUser(userId: string): Promise<number> {
    const userBookmarks = await this.findByUser(userId);
    return userBookmarks.length;
  }

  async getCountBySurah(userId: string, surahId: number): Promise<number> {
    const surahBookmarks = await this.findBySurah(surahId);
    return surahBookmarks.filter((b) => b.belongsToUser(userId)).length;
  }

  async getStatistics(userId: string): Promise<{
    totalBookmarks: number;
    surahsCovered: number;
    mostBookmarkedSurah: { surahId: number; count: number } | null;
    tagsUsed: number;
    bookmarksWithNotes: number;
  }> {
    const userBookmarks = await this.findByUser(userId);

    // Count bookmarks per surah
    const surahCounts: Record<number, number> = {};
    userBookmarks.forEach((bookmark) => {
      surahCounts[bookmark.position.surahId] = (surahCounts[bookmark.position.surahId] || 0) + 1;
    });

    // Find most bookmarked surah
    let mostBookmarkedSurah: { surahId: number; count: number } | null = null;
    Object.entries(surahCounts).forEach(([surahId, count]) => {
      if (!mostBookmarkedSurah || count > mostBookmarkedSurah.count) {
        mostBookmarkedSurah = { surahId: parseInt(surahId), count };
      }
    });

    // Get unique tags
    const allTags = userBookmarks.flatMap((bookmark) => bookmark.tags);
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
    const userBookmarks = await this.findByUser(userId);
    return userBookmarks.map((bookmark) => this.mapBookmarkToStored(bookmark));
  }

  async importBookmarks(userId: string, bookmarks: StoredBookmark[]): Promise<void> {
    if (!this.isStoredBookmarkArray(bookmarks)) {
      logger.warn('Invalid bookmark data for import');
      return;
    }
    for (const bookmarkData of bookmarks) {
      const bookmark = new Bookmark(
        bookmarkData.id || crypto.randomUUID(),
        userId, // Override with current user
        bookmarkData.verseId,
        new BookmarkPosition(
          bookmarkData.position.surahId,
          bookmarkData.position.ayahNumber,
          new Date(bookmarkData.position.timestamp)
        ),
        new Date(bookmarkData.createdAt),
        bookmarkData.notes,
        bookmarkData.tags || []
      );
      await this.save(bookmark);
    }
  }

  async cacheForOffline(userId: string): Promise<void> {
    // Already using localStorage, so inherently offline-capable
    console.log(`Bookmarks for user ${userId} are already cached offline`);
  }

  async clearCache(userId: string): Promise<void> {
    await this.removeAllByUser(userId);
  }
}
