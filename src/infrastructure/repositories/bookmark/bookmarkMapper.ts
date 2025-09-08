import { Bookmark } from '@/src/domain/entities';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';
import { StoredBookmark } from '@/src/domain/value-objects/StoredBookmark';

export function toDomain(stored: StoredBookmark): Bookmark {
  return new Bookmark(
    stored.id,
    stored.userId,
    stored.verseId,
    new BookmarkPosition(
      stored.position.surahId,
      stored.position.ayahNumber,
      new Date(stored.position.timestamp)
    ),
    new Date(stored.createdAt),
    stored.notes,
    stored.tags || []
  );
}

export function toPersistence(bookmark: Bookmark): StoredBookmark {
  return {
    id: bookmark.id,
    userId: bookmark.userId,
    verseId: bookmark.verseId,
    position: bookmark.position.toPlainObject(),
    createdAt: bookmark.createdAt.toISOString(),
    notes: bookmark.notes,
    tags: bookmark.tags,
  };
}
