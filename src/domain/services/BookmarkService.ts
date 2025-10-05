import { v4 as uuidv4 } from 'uuid';

import { Bookmark, Verse } from '@/src/domain/entities';
import {
  BookmarkAlreadyExistsError,
  BookmarkNotFoundError,
  UnauthorizedBookmarkError,
  VerseNotFoundError,
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
    const { userId, surahId, ayahNumber, notes, tags } = this.normalizeBookmarkParams(args);
    const verse = await this.getVerseOrThrow(surahId, ayahNumber);
    const position = this.createPosition(surahId, ayahNumber);
    await this.ensureBookmarkNotExists(userId, position);
    const bookmark = this.buildBookmark({
      userId,
      verse,
      position,
      ...(notes ? { notes } : {}),
      ...(tags ? { tags } : {}),
    });
    await this.bookmarkRepository.save(bookmark);
    return bookmark;
  }

  /**
   * Removes a bookmark
   */
  async removeBookmark(userId: string, bookmarkId: string): Promise<void> {
    const bookmark = await this.getBookmarkOrThrow(bookmarkId);
    this.ensureBookmarkOwnership(bookmark, userId);
    await this.bookmarkRepository.remove(bookmarkId);
  }

  /**
   * Checks if a verse is bookmarked by user
   */
  async isVerseBookmarked(userId: string, surahId: number, ayahNumber: number): Promise<boolean> {
    const position = this.createPosition(surahId, ayahNumber);
    return this.bookmarkRepository.existsAtPosition(userId, position);
  }

  /**
   * Gets bookmarks with their corresponding verses
   */
  async getBookmarksWithVerses(
    userId: string,
    limit?: number
  ): Promise<Array<{ bookmark: Bookmark; verse: Verse }>> {
    const bookmarks = await this.bookmarkRepository.findByUser(userId);
    const limited = limit ? bookmarks.slice(0, limit) : bookmarks;
    return Promise.all(limited.map((b) => this.pairBookmarkWithVerse(b)));
  }

  /**
   * Organizes bookmarks by Surah
   */
  async organizeBookmarksBySurah(userId: string): Promise<Map<number, Bookmark[]>> {
    const bookmarks = await this.bookmarkRepository.findByUser(userId);
    return this.groupBookmarksBySurah(bookmarks);
  }

  private normalizeBookmarkParams(args: unknown[]): {
    userId: string;
    surahId: number;
    ayahNumber: number;
    notes?: string;
    tags?: string[];
  } {
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      return args[0] as {
        userId: string;
        surahId: number;
        ayahNumber: number;
        notes?: string;
        tags?: string[];
      };
    }
    const [userId, surahId, ayahNumber, notes, tags] = args as [
      string,
      number,
      number,
      string?,
      string[]?,
    ];
    return {
      userId,
      surahId,
      ayahNumber,
      ...(notes ? { notes } : {}),
      ...(tags ? { tags } : {}),
    };
  }

  private async getVerseOrThrow(surahId: number, ayahNumber: number): Promise<Verse> {
    const verse = await this.verseRepository.findBySurahAndAyah(surahId, ayahNumber);
    if (!verse) {
      throw new VerseNotFoundError(`${surahId}:${ayahNumber}`);
    }
    return verse;
  }

  private createPosition(surahId: number, ayahNumber: number): BookmarkPosition {
    return new BookmarkPosition(surahId, ayahNumber, new Date());
  }

  private async ensureBookmarkNotExists(userId: string, position: BookmarkPosition): Promise<void> {
    const exists = await this.bookmarkRepository.existsAtPosition(userId, position);
    if (exists) {
      throw new BookmarkAlreadyExistsError(userId, position.surahId, position.ayahNumber);
    }
  }

  private buildBookmark(params: {
    userId: string;
    verse: Verse;
    position: BookmarkPosition;
    notes?: string;
    tags?: string[];
  }): Bookmark {
    const { userId, verse, position, notes, tags } = params;
    return new Bookmark({
      id: uuidv4(),
      userId,
      verseId: verse.id,
      position,
      createdAt: new Date(),
      ...(notes ? { notes } : {}),
      ...(tags ? { tags } : {}),
    });
  }

  private async getBookmarkOrThrow(bookmarkId: string): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);
    if (!bookmark) {
      throw new BookmarkNotFoundError(bookmarkId);
    }
    return bookmark;
  }

  private ensureBookmarkOwnership(bookmark: Bookmark, userId: string): void {
    if (!bookmark.belongsToUser(userId)) {
      throw new UnauthorizedBookmarkError('Cannot remove bookmark belonging to another user');
    }
  }

  private async pairBookmarkWithVerse(
    bookmark: Bookmark
  ): Promise<{ bookmark: Bookmark; verse: Verse }> {
    const verse = await this.verseRepository.findById(bookmark.verseId);
    if (!verse) {
      throw new VerseNotFoundError(bookmark.verseId);
    }
    return { bookmark, verse };
  }

  private groupBookmarksBySurah(bookmarks: Bookmark[]): Map<number, Bookmark[]> {
    const organized = new Map<number, Bookmark[]>();

    bookmarks.forEach((bookmark) => {
      const surahId = bookmark.position.surahId;
      if (!organized.has(surahId)) {
        organized.set(surahId, []);
      }
      organized.get(surahId)!.push(bookmark);
    });

    organized.forEach((surahBookmarks) => {
      surahBookmarks.sort((a, b) => a.position.ayahNumber - b.position.ayahNumber);
    });

    return organized;
  }
}
