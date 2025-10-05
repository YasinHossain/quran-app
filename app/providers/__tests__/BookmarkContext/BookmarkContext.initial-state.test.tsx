import { screen, waitFor } from '@testing-library/react';

import { renderWithProvidersAsync, BookmarkTestComponent } from './test-utils';

import type { Folder } from '@/types';

const OLD_BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks';
const BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks_v2';

describe('BookmarkContext initial state', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with an empty array of folders', async () => {
    await renderWithProvidersAsync(<BookmarkTestComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('folders').textContent).toBe('[]');
    });
  });

  it('migrates old bookmarks from localStorage', async () => {
    localStorage.setItem(OLD_BOOKMARKS_STORAGE_KEY, JSON.stringify(['1:1', '1:2']));

    await renderWithProvidersAsync(<BookmarkTestComponent />);

    await waitFor(() => {
      const folders: Folder[] = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders).toHaveLength(1);
      const firstFolder = folders[0];
      if (!firstFolder) {
        throw new Error('Expected a folder to exist after migration');
      }
      expect(firstFolder.name).toBe('Uncategorized');
      const verseIds: string[] = [];
      for (const b of firstFolder.bookmarks) {
        verseIds.push(b.verseId);
      }
      expect(verseIds).toEqual(['1:1', '1:2']);
      expect(localStorage.getItem(OLD_BOOKMARKS_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(BOOKMARKS_STORAGE_KEY)).toBeDefined();
    });
  });
});
