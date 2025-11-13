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
 * Metadata describing the most recent verse interaction within a surah.
 * Stored by surah id in local storage to power the "Recent" experience.
 */
export interface LastReadEntry {
  /** Last visited ayah number within the surah (1-indexed). */
  verseNumber: number;
  /** Timestamp (ms since epoch) of when the visit occurred. */
  updatedAt: number;
  /** Verse key in `{surah}:{ayah}` format for precise lookups. */
  verseKey?: string;
  /** Global verse id from the API for legacy compatibility. */
  globalVerseId?: number;
  /**
   * Legacy storage field (previously stored as per-surah verse number or global verse id).
   * Retained for migration purposes.
   */
  verseId?: number;
}

/**
 * Map of surah id -> last read metadata.
 */
export type LastReadMap = Record<string, LastReadEntry>;

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
}

/**
 * A planner entry for tracking progress on memorizing specific surahs or verse ranges.
 */
export interface PlannerPlan {
  /** Unique identifier for this planner entry. */
  id: string;

  /** Surah ID this planner entry is for. */
  surahId: number;

  /** First verse included in this plan (1-indexed, clamped to surah range). */
  startVerse?: number;

  /** Last verse included in this plan (1-indexed, clamped to surah range). */
  endVerse?: number;

  /** Total number of verses targeted for memorization in this surah. */
  targetVerses: number;

  /** Number of verses already memorized and confirmed. */
  completedVerses: number;

  /** Timestamp when the planner entry was created (ms since epoch). */
  createdAt: number;

  /** Timestamp of last progress update (ms since epoch). */
  lastUpdated: number;

  /** Optional notes about the planner entry. */
  notes?: string;

  /** Estimated number of days to complete the plan. */
  estimatedDays?: number;
}
