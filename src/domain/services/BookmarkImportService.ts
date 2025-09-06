import { v4 as uuidv4 } from 'uuid';

import { Bookmark } from '../entities';
import { IBookmarkRepository } from '../repositories/IBookmarkRepository';
import { IVerseRepository } from '../repositories/IVerseRepository';
import { BookmarkPosition } from '../value-objects/BookmarkPosition';
import { StoredBookmark } from '../value-objects/StoredBookmark';

/**
 * Handles bookmark import and export operations
 */
export class BookmarkImportService {
  constructor(
    private bookmarkRepository: IBookmarkRepository,
    private verseRepository: IVerseRepository
  ) {}

  /**
   * Imports bookmarks from external data
   */
  async importBookmarks(
    userId: string,
    importData: Array<{ surahId: number; ayahNumber: number; notes?: string; tags?: string[] }>
  ): Promise<Bookmark[]> {
    const validBookmarks: Bookmark[] = [];

    for (const data of importData) {
      try {
        const verse = await this.verseRepository.findBySurahAndAyah(data.surahId, data.ayahNumber);
        if (!verse) {
          continue;
        }

        const position = new BookmarkPosition(data.surahId, data.ayahNumber, new Date());
        const exists = await this.bookmarkRepository.existsAtPosition(userId, position);
        if (exists) {
          continue;
        }

        const bookmark = new Bookmark(
          uuidv4(),
          userId,
          verse.id,
          position,
          new Date(),
          data.notes,
          data.tags || []
        );

        validBookmarks.push(bookmark);
      } catch {
        continue;
      }
    }

    if (validBookmarks.length > 0) {
      await this.bookmarkRepository.saveMany(validBookmarks);
    }

    return validBookmarks;
  }

  /**
   * Exports user bookmarks
   */
  async exportBookmarks(userId: string): Promise<StoredBookmark[]> {
    return this.bookmarkRepository.exportBookmarks(userId);
  }
}
