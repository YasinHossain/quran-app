/**
 * Domain Entity: Bookmark
 * 
 * Represents a saved verse reference with rich metadata and business logic.
 * This is a domain entity that encapsulates bookmark-related business rules.
 */

export interface BookmarkMetadata {
  verseKey?: string;
  verseText?: string;
  surahName?: string;
  translation?: string;
  verseApiId?: number;
}

export class Bookmark {
  private constructor(
    public readonly id: string,
    public readonly verseId: string,
    public readonly createdAt: number,
    public readonly metadata?: BookmarkMetadata
  ) {}

  /**
   * Factory method to create a new bookmark
   */
  static create(verseId: string, metadata?: BookmarkMetadata): Bookmark {
    const id = `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return new Bookmark(id, verseId, Date.now(), metadata);
  }

  /**
   * Factory method to reconstruct bookmark from storage
   */
  static fromStorage(data: {
    id?: string;
    verseId: string;
    createdAt: number;
    metadata?: BookmarkMetadata;
  }): Bookmark {
    const id = data.id || `bookmark_${data.createdAt}_${Math.random().toString(36).substr(2, 9)}`;
    return new Bookmark(id, data.verseId, data.createdAt, data.metadata);
  }

  /**
   * Update bookmark metadata (returns new instance - immutable)
   */
  withMetadata(metadata: BookmarkMetadata): Bookmark {
    return new Bookmark(this.id, this.verseId, this.createdAt, {
      ...this.metadata,
      ...metadata
    });
  }

  /**
   * Check if bookmark has complete metadata for display
   */
  hasCompleteMetadata(): boolean {
    return !!(
      this.metadata?.verseKey &&
      this.metadata?.verseText &&
      this.metadata?.surahName
    );
  }

  /**
   * Get display-friendly verse reference
   */
  getDisplayReference(): string {
    if (this.metadata?.surahName && this.metadata?.verseKey) {
      const [, ayahNumber] = this.metadata.verseKey.split(':');
      return `${this.metadata.surahName}, Verse ${ayahNumber}`;
    }
    return `Verse ${this.verseId}`;
  }

  /**
   * Get verse coordinates from verse key
   */
  getVerseCoordinates(): { surahId: number; ayahNumber: number } | null {
    const verseKey = this.metadata?.verseKey || this.verseId;
    if (/:/.test(verseKey)) {
      const [surahId, ayahNumber] = verseKey.split(':').map(Number);
      return { surahId, ayahNumber };
    }
    return null;
  }

  /**
   * Check if this bookmark matches a verse identifier
   */
  matchesVerse(verseId: string): boolean {
    return this.verseId === verseId || this.metadata?.verseKey === verseId;
  }

  /**
   * Get age of bookmark in days
   */
  getAgeInDays(): number {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  }

  /**
   * Serialize for storage
   */
  toStorage(): BookmarkStorageData {
    return {
      id: this.id,
      verseId: this.verseId,
      createdAt: this.createdAt,
      verseApiId: this.metadata?.verseApiId,
      verseKey: this.metadata?.verseKey,
      verseText: this.metadata?.verseText,
      surahName: this.metadata?.surahName,
      translation: this.metadata?.translation
    };
  }
}

/**
 * Type for bookmark data as stored in localStorage/database
 */
export interface BookmarkStorageData {
  id: string;
  verseId: string;
  createdAt: number;
  verseApiId?: number;
  verseKey?: string;
  verseText?: string;
  surahName?: string;
  translation?: string;
}

/**
 * Enhanced bookmark with full verse content for display
 */
export class BookmarkWithVerse extends Bookmark {
  constructor(
    bookmark: Bookmark,
    public readonly verse: {
      id: number;
      verse_key: string;
      text_uthmani: string;
      surahId: number;
      ayahNumber: number;
      surahNameEnglish: string;
      surahNameArabic: string;
      translations?: Array<{
        id: number;
        resource_id: number;
        text: string;
      }>;
    }
  ) {
    super(bookmark.id, bookmark.verseId, bookmark.createdAt, bookmark.metadata);
  }

  /**
   * Get primary translation text
   */
  getPrimaryTranslation(): string | null {
    return this.verse.translations?.[0]?.text || this.metadata?.translation || null;
  }
}