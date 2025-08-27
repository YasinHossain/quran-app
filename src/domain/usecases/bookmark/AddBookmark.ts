/**
 * Use Case: Add Bookmark
 *
 * Handles the business logic for adding a verse to a bookmark folder.
 * Includes validation, metadata fetching, and folder management.
 */

import { Bookmark, Folder } from '../../entities';
import { IBookmarkRepository, IVerseRepository } from '../../repositories';

export interface AddBookmarkRequest {
  verseId: string;
  folderId?: string; // If not provided, adds to default or creates new folder
  fetchMetadata?: boolean;
  translationId?: number;
}

export interface AddBookmarkResponse {
  bookmark: Bookmark;
  folder: Folder;
  wasCreated: boolean; // true if bookmark was created, false if already existed
}

export class AddBookmark {
  constructor(
    private bookmarkRepository: IBookmarkRepository,
    private verseRepository: IVerseRepository
  ) {}

  async execute(request: AddBookmarkRequest): Promise<AddBookmarkResponse> {
    const { verseId, folderId, fetchMetadata = true, translationId = 20 } = request;

    // Validate verse ID format
    if (!this.isValidVerseId(verseId)) {
      throw new Error(`Invalid verse ID format: ${verseId}`);
    }

    // Check if bookmark already exists
    const existingBookmark = await this.bookmarkRepository.findBookmarkFolder(verseId);
    if (existingBookmark) {
      return {
        bookmark: existingBookmark.bookmark,
        folder: existingBookmark.folder,
        wasCreated: false,
      };
    }

    // Create bookmark with optional metadata
    let bookmark = Bookmark.create(verseId);

    if (fetchMetadata) {
      try {
        const metadata = await this.fetchBookmarkMetadata(verseId, translationId);
        bookmark = bookmark.withMetadata(metadata);
      } catch (error) {
        // Continue without metadata if fetch fails
        console.warn(`Failed to fetch metadata for verse ${verseId}:`, error);
      }
    }

    // Handle folder selection/creation
    let targetFolder: Folder;

    if (folderId) {
      // Use specified folder
      const existingFolder = await this.bookmarkRepository.getFolder(folderId);
      if (!existingFolder) {
        throw new Error(`Folder not found: ${folderId}`);
      }
      targetFolder = existingFolder.addBookmark(bookmark);
    } else {
      // Use or create default folder
      targetFolder = await this.getOrCreateDefaultFolder();
      targetFolder = targetFolder.addBookmark(bookmark);
    }

    // Save the updated folder
    await this.bookmarkRepository.saveFolder(targetFolder);

    return {
      bookmark,
      folder: targetFolder,
      wasCreated: true,
    };
  }

  private async fetchBookmarkMetadata(verseId: string, translationId: number) {
    try {
      // Try to get verse by key first (e.g., "2:255")
      let verse;
      if (this.isVerseKey(verseId)) {
        verse = await this.verseRepository.getByKey(verseId, [translationId]);
      } else {
        verse = await this.verseRepository.getById(parseInt(verseId), [translationId]);
      }

      if (!verse) {
        throw new Error(`Verse not found: ${verseId}`);
      }

      const coordinates = verse.getCoordinates();
      const metadata = await this.verseRepository.getVerseMetadata(verse.verse_key);

      return {
        verseKey: verse.verse_key,
        verseText: verse.text_uthmani,
        surahName: metadata?.surahName || `Surah ${coordinates.surahId}`,
        translation: verse.getPrimaryTranslation(),
        verseApiId: verse.id,
      };
    } catch (error) {
      throw new Error(`Failed to fetch verse metadata: ${error.message}`);
    }
  }

  private async getOrCreateDefaultFolder(): Promise<Folder> {
    const folders = await this.bookmarkRepository.getFolders();

    // Look for existing default folder
    const defaultFolder = folders.find((f) => f.name === 'My Bookmarks');
    if (defaultFolder) {
      return defaultFolder;
    }

    // Create new default folder
    const newFolder = Folder.create('My Bookmarks', {
      color: '#7C3AED',
      icon: 'bookmark',
      description: 'Default bookmark collection',
    });

    await this.bookmarkRepository.saveFolder(newFolder);
    return newFolder;
  }

  private isValidVerseId(verseId: string): boolean {
    // Valid formats: "123" (numeric ID) or "2:255" (surah:ayah)
    return /^\d+$/.test(verseId) || /^\d+:\d+$/.test(verseId);
  }

  private isVerseKey(verseId: string): boolean {
    return /^\d+:\d+$/.test(verseId);
  }
}
