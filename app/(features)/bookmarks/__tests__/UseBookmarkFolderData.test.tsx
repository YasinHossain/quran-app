import {
  __verseCache,
  VERSE_CACHE_LIMIT,
  clearCache,
  // Exported for testing
  getVerseWithCache,
} from '@/app/(features)/bookmarks/[folderId]/hooks/useBookmarkFolderData';

import type { Verse, Chapter } from '@/types';

jest.mock('@/lib/api', () => ({
  getVerseByKey: jest.fn(async (key: string) => ({ verse_key: key }) as Verse),
  getVerseById: jest.fn(async (id: string) => ({ verse_key: id }) as Verse),
}));

describe('verse cache', () => {
  beforeEach(() => {
    clearCache();
  });

  const chapters: Chapter[] = [
    {
      id: 1,
      name_simple: 'Al-Fatihah',
      name_arabic: 'الفاتحة',
      revelation_place: 'makkah',
      verses_count: VERSE_CACHE_LIMIT,
    },
  ];

  it('evicts oldest entry when cache limit exceeded', async () => {
    for (let i = 0; i < VERSE_CACHE_LIMIT; i++) {
      await getVerseWithCache(String(i), 1, chapters);
    }

    expect(__verseCache.size).toBe(VERSE_CACHE_LIMIT);

    await getVerseWithCache('overflow', 1, chapters);

    expect(__verseCache.size).toBe(VERSE_CACHE_LIMIT);
    expect(__verseCache.has('0-1')).toBe(false);
    expect(__verseCache.has('overflow-1')).toBe(true);
  });
});
