/**
 * Application Service: BookmarkService
 * 
 * Orchestrates bookmark-related use cases and provides a clean API for React components.
 * This is the main interface between React and the domain layer.
 */

import { 
  IBookmarkRepository, 
  IVerseRepository 
} from '../../domain/repositories';

import { 
  AddBookmark, 
  RemoveBookmark, 
  CreateFolder,
  type AddBookmarkRequest,
  type AddBookmarkResponse,
  type RemoveBookmarkRequest,
  type RemoveBookmarkResponse,
  type CreateFolderRequest,
  type CreateFolderResponse
} from '../../domain/usecases/bookmark';

import { 
  Bookmark, 
  Folder, 
  type FolderCustomization 
} from '../../domain/entities';

export interface BookmarkServiceConfig {
  defaultTranslationId?: number;
  fetchMetadataByDefault?: boolean;
}

export class BookmarkService {
  private addBookmarkUseCase: AddBookmark;
  private removeBookmarkUseCase: RemoveBookmark;
  private createFolderUseCase: CreateFolder;
  
  private config: Required<BookmarkServiceConfig>;

  constructor(
    private bookmarkRepository: IBookmarkRepository,
    private verseRepository: IVerseRepository,
    config: BookmarkServiceConfig = {}
  ) {
    this.config = {
      defaultTranslationId: 20,
      fetchMetadataByDefault: true,
      ...config
    };

    // Initialize use cases
    this.addBookmarkUseCase = new AddBookmark(bookmarkRepository, verseRepository);
    this.removeBookmarkUseCase = new RemoveBookmark(bookmarkRepository);
    this.createFolderUseCase = new CreateFolder(bookmarkRepository);
  }

  // Bookmark operations
  async addBookmark(
    verseId: string, 
    options: {
      folderId?: string;
      translationId?: number;
      fetchMetadata?: boolean;
    } = {}
  ): Promise<AddBookmarkResponse> {
    const request: AddBookmarkRequest = {
      verseId,
      folderId: options.folderId,
      translationId: options.translationId || this.config.defaultTranslationId,
      fetchMetadata: options.fetchMetadata ?? this.config.fetchMetadataByDefault
    };

    return this.addBookmarkUseCase.execute(request);
  }

  async removeBookmark(
    verseId: string,
    folderId?: string
  ): Promise<RemoveBookmarkResponse> {
    const request: RemoveBookmarkRequest = {
      verseId,
      folderId
    };

    return this.removeBookmarkUseCase.execute(request);
  }

  async toggleBookmark(
    verseId: string,
    folderId?: string
  ): Promise<{ action: 'added' | 'removed'; bookmark?: Bookmark; folder?: Folder }> {
    // Check if bookmark exists
    const existingLocation = await this.bookmarkRepository.findBookmarkFolder(verseId);
    
    if (existingLocation) {
      // Remove existing bookmark
      const result = await this.removeBookmark(verseId, folderId);
      return {
        action: 'removed',
        bookmark: existingLocation.bookmark,
        folder: result.folder
      };
    } else {
      // Add new bookmark
      const result = await this.addBookmark(verseId, { folderId });
      return {
        action: 'added',
        bookmark: result.bookmark,
        folder: result.folder
      };
    }
  }

  async isBookmarked(verseId: string): Promise<boolean> {
    const location = await this.bookmarkRepository.findBookmarkFolder(verseId);
    return location !== null;
  }

  async findBookmarkLocation(verseId: string): Promise<{ folder: Folder; bookmark: Bookmark } | null> {
    return this.bookmarkRepository.findBookmarkFolder(verseId);
  }

  // Folder operations
  async createFolder(
    name: string,
    customization?: FolderCustomization
  ): Promise<CreateFolderResponse> {
    const request: CreateFolderRequest = {
      name,
      customization
    };

    return this.createFolderUseCase.execute(request);
  }

  async getFolders(): Promise<Folder[]> {
    return this.bookmarkRepository.getFolders();
  }

  async getFolder(folderId: string): Promise<Folder | null> {
    return this.bookmarkRepository.getFolder(folderId);
  }

  async deleteFolder(folderId: string): Promise<void> {
    const folder = await this.bookmarkRepository.getFolder(folderId);
    if (!folder) {
      throw new Error(`Folder not found: ${folderId}`);
    }

    if (!folder.isEmpty()) {
      throw new Error(`Cannot delete non-empty folder: ${folder.name}`);
    }

    await this.bookmarkRepository.deleteFolder(folderId);
  }

  async renameFolder(
    folderId: string,
    newName: string
  ): Promise<Folder> {
    const folder = await this.bookmarkRepository.getFolder(folderId);
    if (!folder) {
      throw new Error(`Folder not found: ${folderId}`);
    }

    const renamedFolder = folder.rename(newName);
    await this.bookmarkRepository.saveFolder(renamedFolder);
    return renamedFolder;
  }

  async updateFolderCustomization(
    folderId: string,
    customization: FolderCustomization
  ): Promise<Folder> {
    const folder = await this.bookmarkRepository.getFolder(folderId);
    if (!folder) {
      throw new Error(`Folder not found: ${folderId}`);
    }

    const updatedFolder = folder.updateCustomization(customization);
    await this.bookmarkRepository.saveFolder(updatedFolder);
    return updatedFolder;
  }

  // Pinned verses operations
  async togglePinned(verseId: string): Promise<{ action: 'pinned' | 'unpinned' }> {
    const isPinned = await this.bookmarkRepository.isVersePinned(verseId);
    
    if (isPinned) {
      await this.bookmarkRepository.removePinnedVerse(verseId);
      return { action: 'unpinned' };
    } else {
      // Create bookmark with metadata
      const result = await this.addBookmark(verseId);
      await this.bookmarkRepository.addPinnedVerse(result.bookmark);
      return { action: 'pinned' };
    }
  }

  async isPinned(verseId: string): Promise<boolean> {
    return this.bookmarkRepository.isVersePinned(verseId);
  }

  async getPinnedVerses(): Promise<Bookmark[]> {
    return this.bookmarkRepository.getPinnedVerses();
  }

  // Search and bulk operations
  async searchBookmarks(query: string): Promise<{ folder: Folder; bookmark: Bookmark }[]> {
    return this.bookmarkRepository.searchBookmarks(query);
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    return this.bookmarkRepository.getAllBookmarks();
  }

  async exportData(): Promise<{
    folders: any[];
    pinnedVerses: any[];
    exportedAt: string;
  }> {
    return this.bookmarkRepository.exportData();
  }

  async importData(data: {
    folders: any[];
    pinnedVerses: any[];
  }): Promise<void> {
    return this.bookmarkRepository.importData(data);
  }

  // Statistics and insights
  async getStatistics(): Promise<{
    totalFolders: number;
    totalBookmarks: number;
    totalPinnedVerses: number;
    folderStats: Array<{
      folder: Folder;
      stats: ReturnType<Folder['getStatistics']>;
    }>;
  }> {
    const folders = await this.getFolders();
    const pinnedVerses = await this.getPinnedVerses();
    const allBookmarks = await this.getAllBookmarks();

    const folderStats = folders.map(folder => ({
      folder,
      stats: folder.getStatistics()
    }));

    return {
      totalFolders: folders.length,
      totalBookmarks: allBookmarks.length,
      totalPinnedVerses: pinnedVerses.length,
      folderStats
    };
  }

  async getBookmarksNeedingMetadata(): Promise<Bookmark[]> {
    const allBookmarks = await this.getAllBookmarks();
    return allBookmarks.filter(bookmark => !bookmark.hasCompleteMetadata());
  }

  async refreshBookmarkMetadata(
    verseId: string,
    translationId?: number
  ): Promise<Bookmark | null> {
    const location = await this.findBookmarkLocation(verseId);
    if (!location) return null;

    // Fetch fresh metadata
    const verse = await this.verseRepository.getByKey(
      verseId, 
      [translationId || this.config.defaultTranslationId]
    );

    if (!verse) return location.bookmark;

    const coordinates = verse.getCoordinates();
    const metadata = await this.verseRepository.getVerseMetadata(verse.verse_key);

    const updatedMetadata = {
      verseKey: verse.verse_key,
      verseText: verse.text_uthmani,
      surahName: metadata?.surahName || `Surah ${coordinates.surahId}`,
      translation: verse.getPrimaryTranslation(),
      verseApiId: verse.id
    };

    const updatedBookmark = location.bookmark.withMetadata(updatedMetadata);
    const updatedFolder = location.folder.updateBookmark(verseId, updatedBookmark);
    
    await this.bookmarkRepository.saveFolder(updatedFolder);
    return updatedBookmark;
  }

  // Utility methods
  async suggestFolderColors(): Promise<string[]> {
    return this.createFolderUseCase.suggestColors();
  }

  suggestFolderIcons(): string[] {
    return this.createFolderUseCase.suggestIcons();
  }

  validateFolderName(name: string): { isValid: boolean; error?: string } {
    if (!Folder.isValidName(name)) {
      return {
        isValid: false,
        error: 'Folder name must be 1-100 characters and not empty'
      };
    }
    return { isValid: true };
  }
}