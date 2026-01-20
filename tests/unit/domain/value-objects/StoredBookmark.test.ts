import { isStoredBookmark } from '@/src/domain/value-objects/StoredBookmark';

describe('StoredBookmark type guard', () => {
  it('returns false for non-objects', () => {
    expect(isStoredBookmark(null)).toBe(false);
    expect(isStoredBookmark(undefined)).toBe(false);
    expect(isStoredBookmark('nope')).toBe(false);
    expect(isStoredBookmark(123)).toBe(false);
  });

  it('returns false when required bookmark fields are missing or wrong types', () => {
    expect(isStoredBookmark({})).toBe(false);
    expect(isStoredBookmark({ id: 1 })).toBe(false);
    expect(
      isStoredBookmark({
        id: 'id',
        userId: 'user',
        verseId: 'verse',
        createdAt: '2026-01-01T00:00:00.000Z',
        tags: [],
        position: null,
      })
    ).toBe(false);
  });

  it('returns false when position is invalid', () => {
    expect(
      isStoredBookmark({
        id: 'id',
        userId: 'user',
        verseId: 'verse',
        createdAt: '2026-01-01T00:00:00.000Z',
        tags: [],
        position: { surahId: '1', ayahNumber: 1, timestamp: 't' },
      })
    ).toBe(false);
  });

  it('returns true for a valid stored bookmark', () => {
    expect(
      isStoredBookmark({
        id: 'id',
        userId: 'user',
        verseId: 'verse',
        createdAt: '2026-01-01T00:00:00.000Z',
        tags: ['tag'],
        notes: 'note',
        position: {
          surahId: 1,
          ayahNumber: 2,
          verseKey: '1:2',
          timestamp: '2026-01-01T00:00:00.000Z',
          isFirstVerse: false,
          displayText: 'Surah 1, Verse 2',
        },
      })
    ).toBe(true);
  });
});
