import { v4 as uuidv4 } from 'uuid';

import { Bookmark, Verse } from '@/src/domain/entities';
import {
  BookmarkAlreadyExistsError,
  VerseNotFoundError,
  BookmarkNotFoundError,
  UnauthorizedBookmarkError,
} from '@/src/domain/errors/DomainErrors';
import { IBookmarkRepository } from '@/src/domain/repositories/IBookmarkRepository';
import { IVerseRepository } from '@/src/domain/repositories/IVerseRepository';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';

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
  async bookmarkVerse(params: {
    userId: string;
    surahId: number;
    ayahNumber: number;
    notes?: string;
    tags?: string[];
  }): Promise<Bookmark>;
  async bookmarkVerse(
    userId: string,
    surahId: number,
    ayahNumber: number,
    notes?: string,
    tags?: string[]
  ): Promise<Bookmark>;
  async bookmarkVerse(...args: unknown[]): Promise<Bookmark> {
    const { userId, surahId, ayahNumber, notes, tags } =
      args.length === 1 && typeof args[0] === 'object' && args[0] !== null
        ? (args[0] as {
            userId: string;
            surahId: number;
            ayahNumber: number;
            notes?: string;
            tags?: string[];
          })
        : (() => {
            const [userId, surahId, ayahNumber, notes, tags] = args as [
              string,
              number,
              number,
              string?,
              string[]?,
            ];
            return { userId, surahId, ayahNumber, notes, tags };
          })();
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
    const bookmark = new Bookmark({
      id: uuidv4(),
      userId,
      verseId: verse.id,
      position,
      createdAt: new Date(),
      notes,
      tags,
    });

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
