/**
 * A single bookmarked verse reference.
 */
export interface Bookmark {
  /** Quran verse identifier (e.g., `1:1`). */
  verseId: string;
  /** Timestamp of when the bookmark was created. */
  createdAt: number;
}

/**
 * A collection of bookmarks grouped under a user-defined folder.
 */
export interface Folder {
  /** Unique folder identifier. */
  id: string;
  /** Display name for the folder. */
  name: string;
  /** Bookmarks contained in this folder. */
  bookmarks: Bookmark[];
  /** Timestamp of when the folder was created. */
  createdAt: number;
  /** Folder color customization. */
  color?: string;
  /** Folder icon customization. */
  icon?: string;
}

/**
 * Enhanced bookmark with verse content for display.
 */
export interface BookmarkWithVerse extends Bookmark {
  verse?: {
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
  };
}
