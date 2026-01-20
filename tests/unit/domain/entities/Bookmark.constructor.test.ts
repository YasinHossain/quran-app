import { Bookmark } from '@/src/domain/entities';
import { BookmarkPosition } from '@/src/domain/value-objects/BookmarkPosition';

describe('Bookmark', () => {
  const position = new BookmarkPosition(1, 1, new Date('2026-01-01T00:00:00.000Z'));

  const createBookmark = (overrides: Partial<ConstructorParameters<typeof Bookmark>[0]> = {}) =>
    new Bookmark({
      id: 'bookmark-1',
      userId: 'user-1',
      verseId: 'verse-1',
      position,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
      ...overrides,
    });

  it('creates a valid bookmark with default tags', () => {
    const bookmark = createBookmark();
    expect(bookmark.tags).toEqual([]);
    expect(bookmark.notes).toBeUndefined();
  });

  it('validates required inputs', () => {
    expect(() => createBookmark({ id: '' })).toThrow('Bookmark ID cannot be empty');
    expect(() => createBookmark({ userId: '   ' })).toThrow('User ID cannot be empty');
    expect(() => createBookmark({ verseId: '' })).toThrow('Verse ID cannot be empty');
    expect(() => createBookmark({ createdAt: null as unknown as Date })).toThrow(
      'Created date is required'
    );
  });

  it('checks ownership via belongsToUser', () => {
    const bookmark = createBookmark({ userId: 'owner' });
    expect(bookmark.belongsToUser('owner')).toBe(true);
    expect(bookmark.belongsToUser('other')).toBe(false);
  });

  it('formats display text with notes and tags', () => {
    const bookmark = createBookmark({ notes: 'Note', tags: ['a', 'b'] });
    expect(bookmark.getDisplayText()).toBe('Surah 1, Verse 1 - Note [a, b]');

    const withoutNotesOrTags = createBookmark({ notes: '   ', tags: [] });
    expect(withoutNotesOrTags.getDisplayText()).toBe('Surah 1, Verse 1');
  });

  it('compares equality by id', () => {
    const a = createBookmark({ id: 'same' });
    const b = createBookmark({ id: 'same' });
    const c = createBookmark({ id: 'different' });
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('serializes to a plain object', () => {
    const bookmark = createBookmark({ notes: '', tags: ['tag'] });
    const plain = bookmark.toPlainObject();

    expect(plain.notes).toBeUndefined();
    expect(plain).toEqual(
      expect.objectContaining({
        id: 'bookmark-1',
        userId: 'user-1',
        verseId: 'verse-1',
        createdAt: '2026-01-02T00:00:00.000Z',
        tags: ['tag'],
        hasNotes: false,
        hasTags: true,
        displayText: 'Surah 1, Verse 1 [tag]',
      })
    );
    expect(plain.position).toEqual(
      expect.objectContaining({
        surahId: 1,
        ayahNumber: 1,
        verseKey: '1:1',
      })
    );
  });
});
