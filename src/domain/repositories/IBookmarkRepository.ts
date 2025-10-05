import { Bookmark } from '@/src/domain/entities';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';
import { StoredBookmark } from '@/src/domain/value-objects/StoredBookmark';

export interface IBookmarkRepository {
  // Basic CRUD operations
  findById(id: string): Promise<Bookmark | null>;
  save(bookmark: Bookmark): Promise<void>;
  remove(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;

  // User-specific operations
  existsByUserAndVerse(userId: string, verseId: string): Promise<boolean>;
  findByUser(userId: string): Promise<Bookmark[]>;
  findByUserWithOptions(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      sortBy?: 'created' | 'position';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<Bookmark[]>;
  findRecent(userId: string, limit?: number): Promise<Bookmark[]>;

  // Position-based queries
  findByVerse(verseId: string): Promise<Bookmark[]>;
  findBySurah(surahId: number): Promise<Bookmark[]>;
  findBySurahRange(surahId: number, fromAyah: number, toAyah: number): Promise<Bookmark[]>;
  findByPosition(position: BookmarkPosition): Promise<Bookmark[]>;
  existsAtPosition(userId: string, position: BookmarkPosition): Promise<boolean>;

  // Tag-based operations
  findByTags(userId: string, tags: string[]): Promise<Bookmark[]>;
  getTagsByUser(userId: string): Promise<string[]>;

  // Notes-based operations
  findWithNotes(userId: string): Promise<Bookmark[]>;

  // Date-based queries
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Bookmark[]>;

  // Search operations
  search(userId: string, query: string): Promise<Bookmark[]>;

  // Navigation helpers
  findNext(userId: string, currentPosition: BookmarkPosition): Promise<Bookmark | null>;
  findPrevious(userId: string, currentPosition: BookmarkPosition): Promise<Bookmark | null>;
  findNearPosition(userId: string, position: BookmarkPosition, radius: number): Promise<Bookmark[]>;

  // Batch operations
  saveMany(bookmarks: Bookmark[]): Promise<void>;
  removeMany(ids: string[]): Promise<void>;
  removeAllByUser(userId: string): Promise<void>;
  removeBySurah(userId: string, surahId: number): Promise<void>;

  // Statistics and analytics
  getCountByUser(userId: string): Promise<number>;
  getCountBySurah(userId: string, surahId: number): Promise<number>;
  getStatistics(userId: string): Promise<{
    totalBookmarks: number;
    surahsCovered: number;
    mostBookmarkedSurah: { surahId: number; count: number } | null;
    tagsUsed: number;
    bookmarksWithNotes: number;
  }>;

  // Import/Export operations
  exportBookmarks(userId: string): Promise<StoredBookmark[]>;
  importBookmarks(userId: string, bookmarks: StoredBookmark[]): Promise<void>;

  // Offline support
  cacheForOffline(userId: string): Promise<void>;
  clearCache(userId: string): Promise<void>;
}
