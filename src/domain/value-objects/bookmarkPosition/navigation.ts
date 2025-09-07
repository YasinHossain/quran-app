/**
 * Position interface for navigation functions
 */
interface Position {
  surahId: number;
  ayahNumber: number;
}

/**
 * Position constructor function type
 */
type PositionConstructor = new (surahId: number, ayahNumber: number, timestamp: Date) => unknown;

/**
 * Gets the next verse position within the same Surah
 */
export function getNextVerse<T>(
  position: Position,
  maxAyahInSurah: number,
  PositionClass: PositionConstructor
): T | null {
  if (position.ayahNumber >= maxAyahInSurah) {
    return null;
  }
  return new PositionClass(position.surahId, position.ayahNumber + 1, new Date()) as T;
}

/**
 * Gets the previous verse position within the same Surah
 */
export function getPreviousVerse<T>(
  position: Position,
  PositionClass: PositionConstructor
): T | null {
  if (position.ayahNumber <= 1) {
    return null;
  }
  return new PositionClass(position.surahId, position.ayahNumber - 1, new Date()) as T;
}
