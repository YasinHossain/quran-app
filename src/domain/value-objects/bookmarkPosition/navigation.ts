import { BookmarkPosition } from '../BookmarkPosition';

/**
 * Gets the next verse position within the same Surah
 */
export function getNextVerse(
  position: BookmarkPosition,
  maxAyahInSurah: number
): BookmarkPosition | null {
  if (position.ayahNumber >= maxAyahInSurah) {
    return null;
  }
  return new BookmarkPosition(position.surahId, position.ayahNumber + 1, new Date());
}

/**
 * Gets the previous verse position within the same Surah
 */
export function getPreviousVerse(position: BookmarkPosition): BookmarkPosition | null {
  if (position.ayahNumber <= 1) {
    return null;
  }
  return new BookmarkPosition(position.surahId, position.ayahNumber - 1, new Date());
}
