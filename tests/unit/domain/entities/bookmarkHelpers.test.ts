import {
  Bookmark,
  hasNotes,
  hasTag,
  hasTags,
  withAddedTag,
  withNotes,
  withRemovedTag,
  withTags,
} from '@/src/domain/entities';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';

describe('bookmarkHelpers', () => {
  const position = new BookmarkPosition(1, 1, new Date('2026-01-01T00:00:00.000Z'));

  const createBookmark = (overrides: Partial<ConstructorParameters<typeof Bookmark>[0]> = {}) =>
    new Bookmark({
      id: 'id',
      userId: 'user',
      verseId: 'verse',
      position,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
      tags: [],
      ...overrides,
    });

  it('updates notes and tags immutably', () => {
    const original = createBookmark({ notes: 'old', tags: ['a'] });

    const updatedNotes = withNotes(original, 'new');
    expect(updatedNotes.notes).toBe('new');
    expect(updatedNotes.tags).toEqual(['a']);
    expect(updatedNotes).not.toBe(original);

    const updatedTags = withTags(original, ['b']);
    expect(updatedTags.notes).toBe('old');
    expect(updatedTags.tags).toEqual(['b']);
    expect(updatedTags).not.toBe(original);
  });

  it('adds and removes tags without duplicates', () => {
    const original = createBookmark({ tags: ['a'] });

    const added = withAddedTag(original, 'b');
    expect(added.tags).toEqual(['a', 'b']);

    const addedDuplicate = withAddedTag(added, 'b');
    expect(addedDuplicate.tags).toEqual(['a', 'b']);

    const removed = withRemovedTag(added, 'a');
    expect(removed.tags).toEqual(['b']);
  });

  it('provides tag/notes predicates', () => {
    const bookmark = createBookmark({ notes: '  note  ', tags: ['x'] });
    expect(hasNotes(bookmark)).toBe(true);
    expect(hasTags(bookmark)).toBe(true);
    expect(hasTag(bookmark, 'x')).toBe(true);
    expect(hasTag(bookmark, 'missing')).toBe(false);

    const empty = createBookmark({ notes: '   ', tags: [] });
    expect(hasNotes(empty)).toBe(false);
    expect(hasTags(empty)).toBe(false);
  });
});
