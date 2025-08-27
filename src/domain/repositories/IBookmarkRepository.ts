/**
 * Repository Interface: IBookmarkRepository
 *
 * Defines the contract for bookmark data persistence and retrieval.
 * This interface abstracts storage details from domain logic.
 */

import { Bookmark, BookmarkStorageData } from '../entities/Bookmark';
import { Folder, FolderStorageData } from '../entities/Folder';

export interface IBookmarkRepository {
  // Folder operations
  /**
   * Get all bookmark folders
   */
  getFolders(): Promise<Folder[]>;

  /**
   * Get a specific folder by ID
   */
  getFolder(folderId: string): Promise<Folder | null>;

  /**
   * Save or update a folder
   */
  saveFolder(folder: Folder): Promise<void>;

  /**
   * Delete a folder
   */
  deleteFolder(folderId: string): Promise<void>;

  /**
   * Check if a folder exists
   */
  folderExists(folderId: string): Promise<boolean>;

  // Bookmark operations within folders
  /**
   * Find which folder contains a specific bookmark
   */
  findBookmarkFolder(verseId: string): Promise<{ folder: Folder; bookmark: Bookmark } | null>;

  /**
   * Get all bookmarks across all folders
   */
  getAllBookmarks(): Promise<Bookmark[]>;

  /**
   * Search bookmarks across all folders
   */
  searchBookmarks(query: string): Promise<{ folder: Folder; bookmark: Bookmark }[]>;

  // Pinned verses (special bookmark type)
  /**
   * Get all pinned verses
   */
  getPinnedVerses(): Promise<Bookmark[]>;

  /**
   * Add a verse to pinned collection
   */
  addPinnedVerse(bookmark: Bookmark): Promise<void>;

  /**
   * Remove a verse from pinned collection
   */
  removePinnedVerse(verseId: string): Promise<void>;

  /**
   * Check if a verse is pinned
   */
  isVersePinned(verseId: string): Promise<boolean>;

  // Bulk operations
  /**
   * Save multiple folders at once
   */
  saveFolders(folders: Folder[]): Promise<void>;

  /**
   * Export all bookmark data
   */
  exportData(): Promise<{
    folders: FolderStorageData[];
    pinnedVerses: BookmarkStorageData[];
    exportedAt: string;
  }>;

  /**
   * Import bookmark data
   */
  importData(data: {
    folders: FolderStorageData[];
    pinnedVerses: BookmarkStorageData[];
  }): Promise<void>;

  // Storage management
  /**
   * Clear all bookmark data
   */
  clearAll(): Promise<void>;

  /**
   * Get storage statistics
   */
  getStorageStats(): Promise<{
    totalFolders: number;
    totalBookmarks: number;
    totalPinnedVerses: number;
    storageSize: number; // bytes
  }>;
}
