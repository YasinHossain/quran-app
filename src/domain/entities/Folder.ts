/**
 * Domain Entity: Folder
 * 
 * Represents a collection of bookmarks with organization and customization features.
 * Encapsulates folder management business logic.
 */

import { Bookmark, BookmarkStorageData } from './Bookmark';

export interface FolderCustomization {
  color?: string;
  icon?: string;
  description?: string;
}

export class Folder {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly bookmarks: Bookmark[],
    public readonly createdAt: number,
    public readonly customization?: FolderCustomization,
    public readonly lastModified?: number
  ) {}

  /**
   * Factory method to create a new folder
   */
  static create(
    name: string, 
    customization?: FolderCustomization
  ): Folder {
    const id = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    return new Folder(id, name, [], now, customization, now);
  }

  /**
   * Factory method to reconstruct folder from storage
   */
  static fromStorage(data: {
    id: string;
    name: string;
    bookmarks: BookmarkStorageData[];
    createdAt: number;
    customization?: FolderCustomization;
    lastModified?: number;
  }): Folder {
    const bookmarks = data.bookmarks.map(b => Bookmark.fromStorage(b));
    return new Folder(
      data.id,
      data.name,
      bookmarks,
      data.createdAt,
      data.customization,
      data.lastModified
    );
  }

  /**
   * Add bookmark to folder (returns new instance - immutable)
   */
  addBookmark(bookmark: Bookmark): Folder {
    // Check if bookmark already exists
    if (this.bookmarks.some(b => b.matchesVerse(bookmark.verseId))) {
      return this; // No change if already exists
    }

    return new Folder(
      this.id,
      this.name,
      [...this.bookmarks, bookmark],
      this.createdAt,
      this.customization,
      Date.now()
    );
  }

  /**
   * Remove bookmark from folder (returns new instance - immutable)
   */
  removeBookmark(verseId: string): Folder {
    const filteredBookmarks = this.bookmarks.filter(b => !b.matchesVerse(verseId));
    
    // No change if bookmark wasn't found
    if (filteredBookmarks.length === this.bookmarks.length) {
      return this;
    }

    return new Folder(
      this.id,
      this.name,
      filteredBookmarks,
      this.createdAt,
      this.customization,
      Date.now()
    );
  }

  /**
   * Update bookmark in folder (returns new instance - immutable)
   */
  updateBookmark(verseId: string, updatedBookmark: Bookmark): Folder {
    const updatedBookmarks = this.bookmarks.map(b => 
      b.matchesVerse(verseId) ? updatedBookmark : b
    );

    return new Folder(
      this.id,
      this.name,
      updatedBookmarks,
      this.createdAt,
      this.customization,
      Date.now()
    );
  }

  /**
   * Rename folder (returns new instance - immutable)
   */
  rename(newName: string): Folder {
    if (this.name === newName) return this;

    return new Folder(
      this.id,
      newName,
      this.bookmarks,
      this.createdAt,
      this.customization,
      Date.now()
    );
  }

  /**
   * Update customization (returns new instance - immutable)
   */
  updateCustomization(customization: FolderCustomization): Folder {
    const merged = { ...this.customization, ...customization };
    
    return new Folder(
      this.id,
      this.name,
      this.bookmarks,
      this.createdAt,
      merged,
      Date.now()
    );
  }

  /**
   * Find bookmark by verse ID
   */
  findBookmark(verseId: string): Bookmark | null {
    return this.bookmarks.find(b => b.matchesVerse(verseId)) || null;
  }

  /**
   * Check if folder contains a specific verse
   */
  containsVerse(verseId: string): boolean {
    return this.bookmarks.some(b => b.matchesVerse(verseId));
  }

  /**
   * Get bookmark count
   */
  getBookmarkCount(): number {
    return this.bookmarks.length;
  }

  /**
   * Check if folder is empty
   */
  isEmpty(): boolean {
    return this.bookmarks.length === 0;
  }

  /**
   * Get bookmarks sorted by creation date
   */
  getBookmarksSortedByDate(ascending: boolean = false): Bookmark[] {
    return [...this.bookmarks].sort((a, b) => 
      ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
    );
  }

  /**
   * Get bookmarks sorted by surah order
   */
  getBookmarksSortedBySurah(): Bookmark[] {
    return [...this.bookmarks].sort((a, b) => {
      const coordsA = a.getVerseCoordinates();
      const coordsB = b.getVerseCoordinates();
      
      if (!coordsA && !coordsB) return 0;
      if (!coordsA) return 1;
      if (!coordsB) return -1;
      
      // Sort by surah first, then by ayah
      if (coordsA.surahId !== coordsB.surahId) {
        return coordsA.surahId - coordsB.surahId;
      }
      return coordsA.ayahNumber - coordsB.ayahNumber;
    });
  }

  /**
   * Get bookmarks with incomplete metadata
   */
  getBookmarksNeedingMetadata(): Bookmark[] {
    return this.bookmarks.filter(b => !b.hasCompleteMetadata());
  }

  /**
   * Get folder age in days
   */
  getAgeInDays(): number {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  }

  /**
   * Get days since last modification
   */
  getDaysSinceLastModified(): number {
    const lastMod = this.lastModified || this.createdAt;
    return Math.floor((Date.now() - lastMod) / (1000 * 60 * 60 * 24));
  }

  /**
   * Get folder color (with fallback)
   */
  getColor(): string {
    return this.customization?.color || '#7C3AED'; // Default purple
  }

  /**
   * Get folder icon (with fallback)
   */
  getIcon(): string {
    return this.customization?.icon || 'bookmark';
  }

  /**
   * Get folder description
   */
  getDescription(): string | null {
    return this.customization?.description || null;
  }

  /**
   * Check if folder name is valid
   */
  static isValidName(name: string): boolean {
    return name.trim().length > 0 && name.length <= 100;
  }

  /**
   * Search bookmarks within folder
   */
  searchBookmarks(query: string): Bookmark[] {
    const lowerQuery = query.toLowerCase();
    return this.bookmarks.filter(bookmark => {
      const metadata = bookmark.metadata;
      return (
        bookmark.verseId.toLowerCase().includes(lowerQuery) ||
        metadata?.surahName?.toLowerCase().includes(lowerQuery) ||
        metadata?.verseText?.toLowerCase().includes(lowerQuery) ||
        metadata?.translation?.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * Get statistics about the folder
   */
  getStatistics(): FolderStatistics {
    const bookmarks = this.bookmarks;
    const surahIds = new Set(
      bookmarks
        .map(b => b.getVerseCoordinates()?.surahId)
        .filter(Boolean)
    );

    return {
      totalBookmarks: bookmarks.length,
      uniqueSurahs: surahIds.size,
      bookmarksWithMetadata: bookmarks.filter(b => b.hasCompleteMetadata()).length,
      averageAge: bookmarks.length > 0 
        ? bookmarks.reduce((sum, b) => sum + b.getAgeInDays(), 0) / bookmarks.length 
        : 0,
      oldestBookmark: Math.max(...bookmarks.map(b => b.getAgeInDays()), 0),
      newestBookmark: Math.min(...bookmarks.map(b => b.getAgeInDays()), 0)
    };
  }

  /**
   * Convert to storage format
   */
  toStorage(): FolderStorageData {
    return {
      id: this.id,
      name: this.name,
      bookmarks: this.bookmarks.map(b => b.toStorage()),
      createdAt: this.createdAt,
      customization: this.customization,
      lastModified: this.lastModified
    };
  }
}

export interface FolderStatistics {
  totalBookmarks: number;
  uniqueSurahs: number;
  bookmarksWithMetadata: number;
  averageAge: number;
  oldestBookmark: number;
  newestBookmark: number;
}

export interface FolderStorageData {
  id: string;
  name: string;
  bookmarks: BookmarkStorageData[];
  createdAt: number;
  customization?: FolderCustomization;
  lastModified?: number;
}