export { sortChaptersById, parseNumericId } from './shared';
export type { BookmarkUpdatePayload } from './shared';
export type { IdentifierSource } from './identifiers';
export {
  normaliseIdentifier,
  deriveBookmarkIdentifier,
  resolveBookmarkVerseKey,
  normalizeBookmarkWithIdentifier,
  buildIdentifierPatch,
} from './identifiers';
export { buildFallbackVerse, enrichBookmarkWithVerse, buildVerseDataPatch } from './verseData';
export { deriveBookmarkError, deriveBookmarkLoadingState } from './status';
