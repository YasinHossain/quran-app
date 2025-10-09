import { updateBookmarkInFolders } from '@/app/providers/bookmarks/bookmark-utils';
import { loadBookmarksFromStorage } from '@/app/providers/bookmarks/storage-utils';
import { getItem } from '@/lib/utils/safeLocalStorage';

import type { Bookmark, Folder } from '@/types';

jest.mock('@/lib/utils/safeLocalStorage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockedGetItem = getItem as jest.Mock;

describe('bookmark legacy data compatibility', () => {
  beforeEach(() => {
    mockedGetItem.mockReset();
  });

  it('updates stored bookmarks when verseId was saved as a number', () => {
    const legacyBookmark = { verseId: 42 as unknown as string, createdAt: 0 } as Bookmark;
    const folders: Folder[] = [
      {
        id: 'legacy-folder',
        name: 'Legacy',
        createdAt: 0,
        bookmarks: [legacyBookmark],
      },
    ];

    const updated = updateBookmarkInFolders(folders, '42', { surahName: 'Al-Fatihah' });
    expect(updated[0]?.bookmarks[0]?.surahName).toBe('Al-Fatihah');
  });

  it('normalizes verseIds from storage to strings', () => {
    mockedGetItem.mockReturnValueOnce(
      JSON.stringify([
        {
          id: 'f1',
          name: 'Legacy',
          createdAt: 0,
          bookmarks: [{ verseId: 99, createdAt: 0 }],
        },
      ])
    );

    const [folder] = loadBookmarksFromStorage();
    expect(folder?.bookmarks[0]?.verseId).toBe('99');
  });
});
