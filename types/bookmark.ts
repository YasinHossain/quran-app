/**
 * A saved verse reference with optional cached metadata for quick display.
 */
export interface Bookmark {
  /** Numeric verse identifier. */
  verseId: string;
  /** Timestamp when the bookmark was created. */
  createdAt: number; // Store as timestamp
  /** Surah and ayah representation (e.g., `1:1`). */
  verseKey?: string;
  /** Arabic text of the verse. */
  verseText?: string;
  /** English name of the surah. */
  surahName?: string;
  /** Translation text for the verse. */
  translation?: string;
}

/**
 * A collection of bookmarks grouped under a user-defined folder.
 */
export interface Folder {
  /** Unique identifier. */
  id: string; // Store as timestamp string or UUID
  /** Display name for the folder. */
  name: string;
  /** Bookmarks contained in the folder. */
  bookmarks: Bookmark[];
  /** Creation timestamp. */
  createdAt: number;
  /** Optional folder color. */
  color?: string; // Folder color customization
  /** Optional folder icon. */
  icon?: string; // Folder icon customization
}
