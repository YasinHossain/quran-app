/**
 * Server-only API utilities.
 * These should only be imported in Server Components.
 */

export { getChaptersServer, getChapterServer } from './chapters';
export { getVersesOfDayServer } from './verses';
export { getTafsirVersePageDataServer } from './tafsir';
export { getSurahInitialDataServer } from './surah';
export { getJuzInitialDataServer } from './juz';
export { getSurahNavigationListServer } from './navigation';
export { getPrerenderedVersesServer } from './prerenderedVerses';
export {
  CONTEXT_VERSES_EACH_SIDE,
  getVerseCountsServer,
  getVersePageContextServer,
  getVersePageTafsirServer,
  getVersePageVerseServer,
  toVerseCounts,
} from './versePage';
export type { VersePageTafsir, VersePageVerse } from './versePage';
