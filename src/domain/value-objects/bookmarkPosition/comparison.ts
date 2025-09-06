import { BookmarkPosition } from '../BookmarkPosition';

/**
 * Compares two positions for ordering
 */
export function compareTo(a: BookmarkPosition, b: BookmarkPosition): number {
  if (a.surahId !== b.surahId) {
    return a.surahId - b.surahId;
  }
  return a.ayahNumber - b.ayahNumber;
}

/**
 * Checks if one position comes before another
 */
export function isBefore(a: BookmarkPosition, b: BookmarkPosition): boolean {
  return compareTo(a, b) < 0;
}

/**
 * Checks if one position comes after another
 */
export function isAfter(a: BookmarkPosition, b: BookmarkPosition): boolean {
  return compareTo(a, b) > 0;
}

/**
 * Checks if two positions are in the same Surah
 */
export function isInSameSurah(a: BookmarkPosition, b: BookmarkPosition): boolean {
  return a.surahId === b.surahId;
}

/**
 * Gets the distance (in verses) between two positions in the same Surah
 */
export function getDistanceFrom(a: BookmarkPosition, b: BookmarkPosition): number | null {
  if (!isInSameSurah(a, b)) {
    return null;
  }
  return Math.abs(a.ayahNumber - b.ayahNumber);
}

/**
 * Checks if another position is within a specified range
 */
export function isWithinRange(
  a: BookmarkPosition,
  b: BookmarkPosition,
  maxDistance: number
): boolean {
  const distance = getDistanceFrom(a, b);
  return distance !== null && distance <= maxDistance;
}
