import { v4 as uuidv4 } from 'uuid';

import { Bookmark } from '../entities/Bookmark';
import { Verse } from '../entities/Verse';
import {
  BookmarkAlreadyExistsError,
  VerseNotFoundError,
  BookmarkNotFoundError,
  UnauthorizedBookmarkError,
} from '../errors/DomainErrors';
import { IBookmarkRepository } from '../repositories/IBookmarkRepository';
import { IVerseRepository } from '../repositories/IVerseRepository';
import { BookmarkPosition } from '../value-objects/BookmarkPosition';

/**
 * Domain service for bookmark operations
 */
export class BookmarkService {
  constructor(
    private bookmarkRepository: IBookmarkRepository,
    private verseRepository: IVerseRepository
  ) {}

  /**
   * Creates a bookmark for a verse
   */
  async bookmarkVerse(
    userId: string,
    surahId: number,
    ayahNumber: number,
    notes?: string,
    tags: string[] = []
  ): Promise<Bookmark> {
    // Verify verse exists
    const verse = await this.verseRepository.findBySurahAndAyah(surahId, ayahNumber);
    if (!verse) {
      throw new VerseNotFoundError(`${surahId}:${ayahNumber}`);
    }

    // Check if bookmark already exists
    const position = new BookmarkPosition(surahId, ayahNumber, new Date());
    const exists = await this.bookmarkRepository.existsAtPosition(userId, position);
    if (exists) {
      throw new BookmarkAlreadyExistsError(userId, surahId, ayahNumber);
    }

    // Create new bookmark
    const bookmark = new Bookmark(uuidv4(), userId, verse.id, position, new Date(), notes, tags);

    await this.bookmarkRepository.save(bookmark);
    return bookmark;
  }

  /**
   * Removes a bookmark
   */
  async removeBookmark(userId: string, bookmarkId: string): Promise<void> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new BookmarkNotFoundError(bookmarkId);
    }

    if (!bookmark.belongsToUser(userId)) {
      throw new UnauthorizedBookmarkError('Cannot remove bookmark belonging to another user');
    }

    await this.bookmarkRepository.remove(bookmarkId);
  }

  /**
   * Checks if a verse is bookmarked by user
   */
  async isVerseBookmarked(userId: string, surahId: number, ayahNumber: number): Promise<boolean> {
    const position = new BookmarkPosition(surahId, ayahNumber, new Date());
    return await this.bookmarkRepository.existsAtPosition(userId, position);
  }

  /**
   * Gets bookmarks with their corresponding verses
   */
  async getBookmarksWithVerses(
    userId: string,
    limit?: number
  ): Promise<Array<{ bookmark: Bookmark; verse: Verse }>> {
    const bookmarks = await this.bookmarkRepository.findByUser(userId);
    const limitedBookmarks = limit ? bookmarks.slice(0, limit) : bookmarks;

    const result: Array<{ bookmark: Bookmark; verse: Verse }> = [];

    for (const bookmark of limitedBookmarks) {
      const verse = await this.verseRepository.findById(bookmark.verseId);
      if (!verse) {
        throw new VerseNotFoundError(bookmark.verseId);
      }
      result.push({ bookmark, verse });
    }

    return result;
  }

  /**
   * Organizes bookmarks by Surah
   */
  async organizeBookmarksBySurah(userId: string): Promise<Map<number, Bookmark[]>> {
    const bookmarks = await this.bookmarkRepository.findByUser(userId);
    const organized = new Map<number, Bookmark[]>();

    bookmarks.forEach((bookmark) => {
      const surahId = bookmark.position.surahId;
      if (!organized.has(surahId)) {
        organized.set(surahId, []);
      }
      organized.get(surahId)!.push(bookmark);
    });

    // Sort bookmarks within each Surah by ayah number
    organized.forEach((surahBookmarks) => {
      surahBookmarks.sort((a, b) => a.position.ayahNumber - b.position.ayahNumber);
    });

    return organized;
  }

}
