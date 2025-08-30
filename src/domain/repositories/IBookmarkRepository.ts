import { Bookmark } from '../entities/Bookmark';
import { BookmarkPosition } from '../value-objects/BookmarkPosition';
import { IRepository } from './IRepository';

/**
 * Search options for bookmark queries
 */
export interface BookmarkSearchOptions {
  /** Search query text (searches in notes and tags) */
  query?: string;
  /** Filter by specific tags */
  tags?: string[];
  /** Filter by Surah ID */
  surahId?: number;
  /** Filter by creation date range */
  createdAfter?: Date;
  createdBefore?: Date;
  /** Include only bookmarks with notes */
  hasNotes?: boolean;
  /** Include only bookmarks with tags */
  hasTags?: boolean;
  /** Sort order */
  sortBy?: 'createdAt' | 'position' | 'notes';
  sortOrder?: 'asc' | 'desc';
  /** Maximum number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Repository interface for Bookmark domain entity operations.
 * Defines all data access patterns for bookmarks.
 */
export interface IBookmarkRepository extends IRepository<Bookmark, string> {
  /**
   * Finds all bookmarks for a specific user
   */
  findByUser(userId: string): Promise<Bookmark[]>;

  /**
   * Finds bookmarks for a user with search/filter options
   */
  findByUserWithOptions(userId: string, options: BookmarkSearchOptions): Promise<Bookmark[]>;

  /**
   * Finds recent bookmarks for a user (most recently created)
   */
  findRecent(userId: string, limit: number): Promise<Bookmark[]>;

  /**
   * Finds bookmarks for a specific verse
   */
  findByVerse(userId: string, verseId: string): Promise<Bookmark[]>;

  /**
   * Finds bookmarks for a specific Surah
   */
  findBySurah(userId: string, surahId: number): Promise<Bookmark[]>;

  /**
   * Finds bookmarks within a verse range in a specific Surah
   */
  findBySurahRange(
    userId: string,
    surahId: number,
    startAyah: number,
    endAyah: number
  ): Promise<Bookmark[]>;

  /**
   * Finds bookmarks by position
   */
  findByPosition(userId: string, position: BookmarkPosition): Promise<Bookmark | null>;

  /**
   * Finds bookmarks with specific tags
   */
  findByTags(userId: string, tags: string[]): Promise<Bookmark[]>;

  /**
   * Finds bookmarks that contain notes
   */
  findWithNotes(userId: string): Promise<Bookmark[]>;

  /**
   * Finds bookmarks created within a date range
   */
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Bookmark[]>;

  /**
   * Searches bookmarks by text (in notes and tags)
   */
  search(userId: string, options: BookmarkSearchOptions): Promise<Bookmark[]>;

  /**
   * Checks if a specific verse is bookmarked by a user
   */
  existsByUserAndVerse(userId: string, verseId: string): Promise<boolean>;

  /**
   * Checks if a specific position is bookmarked by a user
   */
  existsAtPosition(userId: string, position: BookmarkPosition): Promise<boolean>;

  /**
   * Gets the count of bookmarks for a user
   */
  getCountByUser(userId: string): Promise<number>;

  /**
   * Gets the count of bookmarks for a user in a specific Surah
   */
  getCountBySurah(userId: string, surahId: number): Promise<number>;

  /**
   * Gets all unique tags used by a user
   */
  getTagsByUser(userId: string): Promise<string[]>;

  /**
   * Gets bookmark statistics for a user
   */
  getStatistics(userId: string): Promise<{
    totalBookmarks: number;
    bookmarkedSurahs: number;
    bookmarksWithNotes: number;
    bookmarksWithTags: number;
    uniqueTags: number;
    oldestBookmark: Date | null;
    newestBookmark: Date | null;
    mostBookmarkedSurah: number | null;
  }>;

  /**
   * Finds the next bookmark after a given position
   */
  findNext(userId: string, position: BookmarkPosition): Promise<Bookmark | null>;

  /**
   * Finds the previous bookmark before a given position
   */
  findPrevious(userId: string, position: BookmarkPosition): Promise<Bookmark | null>;

  /**
   * Finds bookmarks near a specific position (within same Surah)
   */
  findNearPosition(userId: string, position: BookmarkPosition, range: number): Promise<Bookmark[]>;

  /**
   * Bulk saves multiple bookmarks
   */
  saveMany(bookmarks: Bookmark[]): Promise<void>;

  /**
   * Bulk removes multiple bookmarks
   */
  removeMany(bookmarkIds: string[]): Promise<void>;

  /**
   * Removes all bookmarks for a user
   */
  removeAllByUser(userId: string): Promise<void>;

  /**
   * Removes all bookmarks for a user in a specific Surah
   */
  removeBySurah(userId: string, surahId: number): Promise<void>;

  /**
   * Exports bookmarks for a user in a portable format
   */
  exportBookmarks(userId: string): Promise<any>;

  /**
   * Imports bookmarks from a portable format
   */
  importBookmarks(userId: string, data: any): Promise<void>;

  /**
   * Caches bookmarks for offline access
   */
  cacheForOffline(userId: string): Promise<void>;

  /**
   * Clears cached bookmarks
   */
  clearCache(userId?: string): Promise<void>;
}
