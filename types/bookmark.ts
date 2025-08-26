/**
 * A saved verse reference with optional cached metadata for quick display.
 */
export interface Bookmark {
  /** Unique verse identifier stored as a string. */
  verseId: string;
  /** Numeric verse identifier from the source API. */
  verseApiId?: number;
  /** Timestamp when the bookmark was created (ms since epoch). */
  createdAt: number;

  /**
   * Surah and ayah representation (e.g., "1:1").
   * Useful for human-readable display and interop with APIs that use verse keys.
   */
  verseKey?: string;

  /** Arabic text of the verse (cached for faster rendering). */
  verseText?: string;

  /** English name of the surah (cached). */
  surahName?: string;

  /** Translation text for the verse (cached). */
  translation?: string;
}

/**
 * Enhanced bookmark with verse content for display-heavy screens.
 * Use when you fetch full verse payloads from the API and want to keep type safety.
 */
export interface BookmarkWithVerse extends Bookmark {
  verse?: {
    /** Numeric verse ID from the source API. */
    id: number;
    /** "surah:ayah" string key (e.g., "1:1"). */
    verse_key: string;
    /** Uthmani script text. */
    text_uthmani: string;

    /** Convenience fields for UI breakdowns. */
    surahId: number;
    ayahNumber: number;
    surahNameEnglish: string;
    surahNameArabic: string;

    /** Optional translations attached to this verse. */
    translations?: Array<{
      id: number;
      resource_id: number;
      text: string;
    }>;
  };
}

/**
 * A collection of bookmarks grouped under a user-defined folder.
 * Folders can be personalized with a color and icon that you can render across the UI.
 */
export interface Folder {
  /** Unique identifier (UUID or timestamp string). */
  id: string;

  /** Display name for the folder. */
  name: string;

  /** Bookmarks contained in this folder. */
  bookmarks: Bookmark[];

  /** Timestamp of when the folder was created (ms since epoch). */
  createdAt: number;

  /**
   * Folder color customization (e.g., hex "#7C3AED", CSS color name, or design-token key).
   * This should be applied to folder badges, list items, and headers in the bookmarks UI.
   */
  color?: string;

  /**
   * Folder icon customization.
   * Suggested values: an icon name from your icon set (e.g., "star", "bookmark", "heart")
   * or a URL to an image if your UI supports it.
   */
  icon?: string;
}

/**
 * A memorization plan for tracking progress on memorizing specific surahs or verse ranges.
 */
export interface MemorizationPlan {
  /** Unique identifier for this memorization plan. */
  id: string;

  /** Surah ID this memorization plan is for. */
  surahId: number;

  /** Total number of verses targeted for memorization in this surah. */
  targetVerses: number;

  /** Number of verses already memorized and confirmed. */
  completedVerses: number;

  /** Timestamp when the memorization plan was created (ms since epoch). */
  createdAt: number;

  /** Timestamp of last progress update (ms since epoch). */
  lastUpdated: number;

  /** Optional notes about the memorization plan. */
  notes?: string;
}
