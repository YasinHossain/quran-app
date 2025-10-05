import { Bookmark } from './Bookmark';

export function withNotes(bookmark: Bookmark, notes: string): Bookmark {
  return new Bookmark({
    id: bookmark.id,
    userId: bookmark.userId,
    verseId: bookmark.verseId,
    position: bookmark.position,
    createdAt: bookmark.createdAt,
    notes,
    tags: bookmark.tags,
  });
}

export function withTags(bookmark: Bookmark, tags: string[]): Bookmark {
  return new Bookmark({
    id: bookmark.id,
    userId: bookmark.userId,
    verseId: bookmark.verseId,
    position: bookmark.position,
    createdAt: bookmark.createdAt,
    ...(bookmark.notes ? { notes: bookmark.notes } : {}),
    tags,
  });
}

export function withAddedTag(bookmark: Bookmark, tag: string): Bookmark {
  const newTags = [...bookmark.tags];
  if (!newTags.includes(tag)) {
    newTags.push(tag);
  }
  return withTags(bookmark, newTags);
}

export function withRemovedTag(bookmark: Bookmark, tag: string): Bookmark {
  return withTags(
    bookmark,
    bookmark.tags.filter((t) => t !== tag)
  );
}

export function hasNotes(bookmark: Bookmark): boolean {
  return Boolean(bookmark.notes && bookmark.notes.trim().length > 0);
}

export function hasTags(bookmark: Bookmark): boolean {
  return bookmark.tags.length > 0;
}

export function hasTag(bookmark: Bookmark, tag: string): boolean {
  return bookmark.tags.includes(tag);
}
