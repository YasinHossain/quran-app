/**
 * Domain Entities Index
 * 
 * Centralized exports for all domain entities.
 * These entities represent the core business objects and rules of the Quran app.
 */

// Bookmark-related entities
export {
  Bookmark,
  BookmarkWithVerse,
  type BookmarkMetadata,
  type BookmarkStorageData
} from './Bookmark';

export {
  Folder,
  type FolderCustomization,
  type FolderStatistics,
  type FolderStorageData
} from './Folder';

// Verse and Word entities
export {
  Verse,
  type Translation,
  type Audio,
  type VerseStorageData
} from './Verse';

export {
  Word,
  type WordTranslation,
  type WordStorageData
} from './Word';

// Memorization entities
export {
  MemorizationPlan,
  type MemorizationStatus,
  type MemorizationDifficulty,
  type VerseProgress,
  type ReviewSession,
  type MemorizationGoal,
  type MemorizationStatistics,
  type MemorizationPlanStorageData
} from './MemorizationPlan';