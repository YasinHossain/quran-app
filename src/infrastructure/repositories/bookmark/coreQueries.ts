import { Bookmark } from '../../../domain/entities';
import { BookmarkPosition } from '../../../domain/value-objects/BookmarkPosition';
import { getStoredBookmarks, mapStoredToBookmark } from './storage';

export async function findByVerse(verseId: string): Promise<Bookmark[]> {
  const stored = getStoredBookmarks();
  return stored.filter((b) => b.verseId === verseId).map((b) => mapStoredToBookmark(b));
}

export async function findBySurah(surahId: number): Promise<Bookmark[]> {
  const stored = getStoredBookmarks();
  return stored
    .filter((b) => b.position.surahId === surahId)
    .map((b) => mapStoredToBookmark(b))
    .sort((a, b) => a.position.ayahNumber - b.position.ayahNumber);
}

export async function findBySurahRange(
  surahId: number,
  fromAyah: number,
  toAyah: number
): Promise<Bookmark[]> {
  const surahBookmarks = await findBySurah(surahId);
  return surahBookmarks.filter(
    (b) => b.position.ayahNumber >= fromAyah && b.position.ayahNumber <= toAyah
  );
}

export async function findByPosition(position: BookmarkPosition): Promise<Bookmark[]> {
  const stored = getStoredBookmarks();
  return stored
    .filter(
      (b) =>
        b.position.surahId === position.surahId && b.position.ayahNumber === position.ayahNumber
    )
    .map((b) => mapStoredToBookmark(b));
}
