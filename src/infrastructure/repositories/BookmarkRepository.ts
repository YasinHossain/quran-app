/**
 * Infrastructure: BookmarkRepository
 * 
 * Implements IBookmarkRepository using localStorage.
 * Handles data persistence for bookmarks and folders.
 */

import { IBookmarkRepository } from '../../domain/repositories';
import { Bookmark, Folder, BookmarkStorageData, FolderStorageData } from '../../domain/entities';

const STORAGE_KEYS = {
  FOLDERS: 'quran-app-bookmark-folders',
  PINNED: 'quran-app-pinned-verses',
  VERSION: 'quran-app-storage-version'
} as const;

const CURRENT_VERSION = '1.0';

export class BookmarkRepository implements IBookmarkRepository {
  private folders: Map<string, Folder> = new Map();
  private pinnedVerses: Bookmark[] = [];
  private initialized = false;

  constructor() {
    this.initializeStorage();
  }

  // Folder operations
  async getFolders(): Promise<Folder[]> {
    await this.ensureInitialized();
    return Array.from(this.folders.values());
  }

  async getFolder(folderId: string): Promise<Folder | null> {
    await this.ensureInitialized();
    return this.folders.get(folderId) || null;
  }

  async saveFolder(folder: Folder): Promise<void> {
    await this.ensureInitialized();
    this.folders.set(folder.id, folder);
    await this.persistFolders();
  }

  async deleteFolder(folderId: string): Promise<void> {
    await this.ensureInitialized();
    this.folders.delete(folderId);
    await this.persistFolders();
  }

  async folderExists(folderId: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.folders.has(folderId);
  }

  // Bookmark operations within folders
  async findBookmarkFolder(verseId: string): Promise<{ folder: Folder; bookmark: Bookmark } | null> {
    await this.ensureInitialized();
    
    for (const folder of this.folders.values()) {
      const bookmark = folder.findBookmark(verseId);
      if (bookmark) {
        return { folder, bookmark };
      }
    }
    return null;
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    await this.ensureInitialized();
    const allBookmarks: Bookmark[] = [];
    
    for (const folder of this.folders.values()) {
      allBookmarks.push(...folder.bookmarks);
    }
    
    return allBookmarks;
  }

  async searchBookmarks(query: string): Promise<{ folder: Folder; bookmark: Bookmark }[]> {
    await this.ensureInitialized();
    const results: { folder: Folder; bookmark: Bookmark }[] = [];
    
    for (const folder of this.folders.values()) {
      const matchingBookmarks = folder.searchBookmarks(query);
      results.push(...matchingBookmarks.map(bookmark => ({ folder, bookmark })));
    }
    
    return results;
  }

  // Pinned verses operations
  async getPinnedVerses(): Promise<Bookmark[]> {
    await this.ensureInitialized();
    return [...this.pinnedVerses];
  }

  async addPinnedVerse(bookmark: Bookmark): Promise<void> {
    await this.ensureInitialized();
    
    // Remove if already exists
    this.pinnedVerses = this.pinnedVerses.filter(b => !b.matchesVerse(bookmark.verseId));
    
    // Add new bookmark
    this.pinnedVerses.push(bookmark);
    await this.persistPinnedVerses();
  }

  async removePinnedVerse(verseId: string): Promise<void> {
    await this.ensureInitialized();
    this.pinnedVerses = this.pinnedVerses.filter(b => !b.matchesVerse(verseId));
    await this.persistPinnedVerses();
  }

  async isVersePinned(verseId: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.pinnedVerses.some(b => b.matchesVerse(verseId));
  }

  // Bulk operations
  async saveFolders(folders: Folder[]): Promise<void> {
    await this.ensureInitialized();
    this.folders.clear();
    folders.forEach(folder => {
      this.folders.set(folder.id, folder);
    });
    await this.persistFolders();
  }

  async exportData(): Promise<{
    folders: FolderStorageData[];
    pinnedVerses: BookmarkStorageData[];
    exportedAt: string;
  }> {
    await this.ensureInitialized();
    return {
      folders: Array.from(this.folders.values()).map(f => f.toStorage()),
      pinnedVerses: this.pinnedVerses.map(b => b.toStorage()),
      exportedAt: new Date().toISOString()
    };
  }

  async importData(data: {
    folders: FolderStorageData[];
    pinnedVerses: BookmarkStorageData[];
  }): Promise<void> {
    // Clear existing data
    this.folders.clear();
    this.pinnedVerses = [];

    // Import folders
    data.folders.forEach(folderData => {
      const folder = Folder.fromStorage(folderData);
      this.folders.set(folder.id, folder);
    });

    // Import pinned verses
    this.pinnedVerses = data.pinnedVerses.map(bookmarkData => 
      Bookmark.fromStorage(bookmarkData)
    );

    // Persist to storage
    await this.persistFolders();
    await this.persistPinnedVerses();
  }

  // Storage management
  async clearAll(): Promise<void> {
    this.folders.clear();
    this.pinnedVerses = [];
    localStorage.removeItem(STORAGE_KEYS.FOLDERS);
    localStorage.removeItem(STORAGE_KEYS.PINNED);
  }

  async getStorageStats(): Promise<{
    totalFolders: number;
    totalBookmarks: number;
    totalPinnedVerses: number;
    storageSize: number;
  }> {
    await this.ensureInitialized();
    
    const foldersData = localStorage.getItem(STORAGE_KEYS.FOLDERS) || '';
    const pinnedData = localStorage.getItem(STORAGE_KEYS.PINNED) || '';
    
    return {
      totalFolders: this.folders.size,
      totalBookmarks: Array.from(this.folders.values()).reduce((sum, f) => sum + f.getBookmarkCount(), 0),
      totalPinnedVerses: this.pinnedVerses.length,
      storageSize: foldersData.length + pinnedData.length
    };
  }

  // Private methods
  private initializeStorage(): void {
    if (this.initialized) return;

    try {
      // Check storage version
      const version = localStorage.getItem(STORAGE_KEYS.VERSION);
      if (version !== CURRENT_VERSION) {
        this.migrateStorage(version);
      }

      // Load folders
      const foldersData = localStorage.getItem(STORAGE_KEYS.FOLDERS);
      if (foldersData) {
        const folders: FolderStorageData[] = JSON.parse(foldersData);
        folders.forEach(folderData => {
          const folder = Folder.fromStorage(folderData);
          this.folders.set(folder.id, folder);
        });
      }

      // Load pinned verses
      const pinnedData = localStorage.getItem(STORAGE_KEYS.PINNED);
      if (pinnedData) {
        const bookmarks: BookmarkStorageData[] = JSON.parse(pinnedData);
        this.pinnedVerses = bookmarks.map(bookmarkData => 
          Bookmark.fromStorage(bookmarkData)
        );
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize bookmark storage:', error);
      this.initialized = true; // Continue with empty state
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      this.initializeStorage();
    }
  }

  private async persistFolders(): Promise<void> {
    try {
      const foldersData = Array.from(this.folders.values()).map(f => f.toStorage());
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(foldersData));
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    } catch (error) {
      console.error('Failed to persist folders:', error);
    }
  }

  private async persistPinnedVerses(): Promise<void> {
    try {
      const pinnedData = this.pinnedVerses.map(b => b.toStorage());
      localStorage.setItem(STORAGE_KEYS.PINNED, JSON.stringify(pinnedData));
    } catch (error) {
      console.error('Failed to persist pinned verses:', error);
    }
  }

  private migrateStorage(currentVersion: string | null): void {
    console.log(`Migrating bookmark storage from ${currentVersion} to ${CURRENT_VERSION}`);
    
    // Migration logic would go here
    // For now, just set the version
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
  }
}