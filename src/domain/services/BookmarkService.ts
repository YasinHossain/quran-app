import { Bookmark } from '../entities/Bookmark';
import { Verse } from '../entities/Verse';
import { BookmarkPosition } from '../value-objects/BookmarkPosition';
import { IBookmarkRepository } from '../repositories/IBookmarkRepository';
import { IVerseRepository } from '../repositories/IVerseRepository';
import {
  BookmarkAlreadyExistsError,
  VerseNotFoundError,
  BookmarkNotFoundError,
} from '../errors/DomainErrors';

/**
 * Domain service for bookmark-related business operations.
 * Coordinates between Bookmark and Verse entities and their repositories.
 */
export class BookmarkService {
  constructor(
    private readonly bookmarkRepository: IBookmarkRepository,
    private readonly verseRepository: IVerseRepository
  ) {}

  /**
   * Creates a new bookmark for a verse
   */
  async bookmarkVerse(
    userId: string,
    surahId: number,
    ayahNumber: number,
    notes?: string,
    tags?: string[]
  ): Promise<Bookmark> {
    // Validate that the verse exists
    const verse = await this.verseRepository.findBySurahAndAyah(surahId, ayahNumber);
    if (!verse) {
      throw new VerseNotFoundError(surahId, ayahNumber);
    }

    // Check if bookmark already exists
    const position = new BookmarkPosition(surahId, ayahNumber, new Date());
    const exists = await this.bookmarkRepository.existsAtPosition(userId, position);
    if (exists) {
      throw new BookmarkAlreadyExistsError(`Bookmark already exists for ${position.toString()}`);
    }

    // Create new bookmark
    const bookmark = new Bookmark(
      this.generateBookmarkId(),
      userId,
      verse.id,
      position,
      new Date(),
      notes,
      tags
    );

    await this.bookmarkRepository.save(bookmark);
    return bookmark;
  }

  /**
   * Removes a bookmark
   */
  async removeBookmark(userId: string, bookmarkId: string): Promise<boolean>;
  async removeBookmark(bookmarkId: string): Promise<boolean>;
  async removeBookmark(userIdOrBookmarkId: string, bookmarkId?: string): Promise<boolean> {
    try {
      if (bookmarkId) {
        // Two parameter version: removeBookmark(userId, bookmarkId)
        const userId = userIdOrBookmarkId;
        const bookmark = await this.bookmarkRepository.findById(bookmarkId);
        if (!bookmark) {
          throw new BookmarkNotFoundError(bookmarkId);
        }

        if (bookmark.userId !== userId) {
          throw new Error('Unauthorized: Cannot remove bookmark belonging to another user');
        }

        await this.bookmarkRepository.remove(bookmarkId);
      } else {
        // One parameter version: removeBookmark(bookmarkId)
        const bookmarkIdToRemove = userIdOrBookmarkId;
        await this.bookmarkRepository.remove(bookmarkIdToRemove);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Updates bookmark notes
   */
  async updateBookmarkNotes(userId: string, bookmarkId: string, notes: string): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new BookmarkNotFoundError(bookmarkId);
    }

    if (bookmark.userId !== userId) {
      throw new Error('Unauthorized: Cannot update bookmark belonging to another user');
    }

    const updatedBookmark = bookmark.withNotes(notes);
    await this.bookmarkRepository.save(updatedBookmark);
    return updatedBookmark;
  }

  /**
   * Updates bookmark tags
   */
  async updateBookmarkTags(userId: string, bookmarkId: string, tags: string[]): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new BookmarkNotFoundError(bookmarkId);
    }

    if (bookmark.userId !== userId) {
      throw new Error('Unauthorized: Cannot update bookmark belonging to another user');
    }

    const updatedBookmark = bookmark.withTags(tags);
    await this.bookmarkRepository.save(updatedBookmark);
    return updatedBookmark;
  }

  /**
   * Adds a tag to a bookmark
   */
  async addTagToBookmark(userId: string, bookmarkId: string, tag: string): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new BookmarkNotFoundError(bookmarkId);
    }

    if (bookmark.userId !== userId) {
      throw new Error('Unauthorized: Cannot update bookmark belonging to another user');
    }

    const updatedBookmark = bookmark.addTag(tag);
    await this.bookmarkRepository.save(updatedBookmark);
    return updatedBookmark;
  }

  /**
   * Removes a tag from a bookmark
   */
  async removeTagFromBookmark(userId: string, bookmarkId: string, tag: string): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new BookmarkNotFoundError(bookmarkId);
    }

    if (bookmark.userId !== userId) {
      throw new Error('Unauthorized: Cannot update bookmark belonging to another user');
    }

    const updatedBookmark = bookmark.removeTag(tag);
    await this.bookmarkRepository.save(updatedBookmark);
    return updatedBookmark;
  }

  /**
   * Checks if a verse is bookmarked by a user
   */
  async isVerseBookmarked(userId: string, surahId: number, ayahNumber: number): Promise<boolean> {
    const position = new BookmarkPosition(surahId, ayahNumber, new Date());
    return await this.bookmarkRepository.existsAtPosition(userId, position);
  }

  /**
   * Gets all bookmarks for a user
   */
  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return await this.bookmarkRepository.findByUser(userId);
  }

  /**
   * Alias for isVerseBookmarked for consistency with presentation layer
   */
  async isBookmarked(userId: string, surahId: number, ayahNumber: number): Promise<boolean> {
    return this.isVerseBookmarked(userId, surahId, ayahNumber);
  }

  /**
   * Gets bookmarks for a user with verses populated
   */
  async getBookmarksWithVerses(
    userId: string,
    limit?: number
  ): Promise<
    Array<{
      bookmark: Bookmark;
      verse: Verse;
    }>
  > {
    const bookmarks = await this.bookmarkRepository.findByUser(userId);
    const limitedBookmarks = limit ? bookmarks.slice(0, limit) : bookmarks;

    const results = await Promise.all(
      limitedBookmarks.map(async (bookmark) => {
        const verse = await this.verseRepository.findById(bookmark.verseId);
        if (!verse) {
          throw new VerseNotFoundError(bookmark.position.surahId, bookmark.position.ayahNumber);
        }
        return { bookmark, verse };
      })
    );

    return results;
  }

  /**
   * Organizes bookmarks by Surah
   */
  async organizeBookmarksBySurah(userId: string): Promise<Map<number, Bookmark[]>> {
    const bookmarks = await this.bookmarkRepository.findByUser(userId);
    const bookmarksBySurah = new Map<number, Bookmark[]>();

    bookmarks.forEach((bookmark) => {
      const surahId = bookmark.position.surahId;
      const existing = bookmarksBySurah.get(surahId) || [];
      existing.push(bookmark);
      bookmarksBySurah.set(surahId, existing);
    });

    // Sort bookmarks within each Surah by ayah number
    bookmarksBySurah.forEach((surahBookmarks, surahId) => {
      surahBookmarks.sort((a, b) => a.position.ayahNumber - b.position.ayahNumber);
      bookmarksBySurah.set(surahId, surahBookmarks);
    });

    return bookmarksBySurah;
  }

  /**
   * Gets bookmark navigation (next/previous bookmarks)
   */
  async getBookmarkNavigation(
    userId: string,
    currentBookmarkId: string
  ): Promise<{
    previous: Bookmark | null;
    next: Bookmark | null;
  }> {
    const currentBookmark = await this.bookmarkRepository.findById(currentBookmarkId);
    if (!currentBookmark) {
      throw new BookmarkNotFoundError(currentBookmarkId);
    }

    if (currentBookmark.userId !== userId) {
      throw new Error('Unauthorized: Cannot access bookmark belonging to another user');
    }

    const [previous, next] = await Promise.all([
      this.bookmarkRepository.findPrevious(userId, currentBookmark.position),
      this.bookmarkRepository.findNext(userId, currentBookmark.position),
    ]);

    return { previous, next };
  }

  /**
   * Imports bookmarks from an external source
   */
  async importBookmarks(
    userId: string,
    bookmarksData: Array<{
      surahId: number;
      ayahNumber: number;
      notes?: string;
      tags?: string[];
      createdAt?: Date;
    }>
  ): Promise<Bookmark[]> {
    const importedBookmarks: Bookmark[] = [];

    for (const data of bookmarksData) {
      // Check if verse exists
      const verse = await this.verseRepository.findBySurahAndAyah(data.surahId, data.ayahNumber);
      if (!verse) {
        console.warn(
          `Verse ${data.surahId}:${data.ayahNumber} not found, skipping bookmark import`
        );
        continue;
      }

      // Check if bookmark already exists
      const position = new BookmarkPosition(data.surahId, data.ayahNumber, new Date());
      const exists = await this.bookmarkRepository.existsAtPosition(userId, position);
      if (exists) {
        console.warn(`Bookmark ${data.surahId}:${data.ayahNumber} already exists, skipping`);
        continue;
      }

      // Create bookmark
      const bookmark = new Bookmark(
        this.generateBookmarkId(),
        userId,
        verse.id,
        position,
        data.createdAt || new Date(),
        data.notes,
        data.tags
      );

      importedBookmarks.push(bookmark);
    }

    // Bulk save all bookmarks
    await this.bookmarkRepository.saveMany(importedBookmarks);
    return importedBookmarks;
  }

  /**
   * Exports bookmarks to a portable format
   */
  async exportBookmarks(userId: string): Promise<any> {
    const bookmarks = await this.bookmarkRepository.findByUser(userId);

    return {
      userId,
      exportedAt: new Date().toISOString(),
      bookmarks: bookmarks.map((bookmark) => bookmark.toPlainObject()),
    };
  }

  /**
   * Generates a unique bookmark ID
   */
  private generateBookmarkId(): string {
    return `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
