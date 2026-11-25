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
export { getSurahRecitationServer } from './recitation';
export type { SurahRecitation } from './recitation';
export {
  CONTEXT_VERSES_EACH_SIDE,
  getVerseCountsServer,
  getVersePageTafsirServer,
  getVersePageVersesServer,
  toVerseCounts,
} from './versePage';
export type { VersePageTafsir, VersePageVerse, VersePageVerses } from './versePage';
export { getReciterResourcesServer, getTranslationResourcesServer } from './resources';
export type { ReciterResource } from './resources';
