import {
  __verseCache,
  VERSE_CACHE_LIMIT,
  clearCache,
  // Exported for testing
  getVerseWithCache,
} from '@/app/(features)/bookmarks/[folderId]/hooks/useBookmarkFolderData';

import type { Verse } from '@/types';

jest.mock('@/lib/api', () => ({
  getVerseByKey: jest.fn(async (key: string) => ({ verse_key: key }) as Verse),
  getVerseById: jest.fn(async (id: string) => ({ verse_key: id }) as Verse),
}));

describe('verse cache', () => {
  beforeEach(() => {
    clearCache();
  });

  it('evicts oldest entry when cache limit exceeded', async () => {
    for (let i = 0; i < VERSE_CACHE_LIMIT; i++) {
      await getVerseWithCache(String(i), 1);
    }

    expect(__verseCache.size).toBe(VERSE_CACHE_LIMIT);

    await getVerseWithCache('overflow', 1);

    expect(__verseCache.size).toBe(VERSE_CACHE_LIMIT);
    expect(__verseCache.has('0-1')).toBe(false);
    expect(__verseCache.has('overflow-1')).toBe(true);
  });
});
