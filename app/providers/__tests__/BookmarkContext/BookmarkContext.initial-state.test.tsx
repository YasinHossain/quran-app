import { screen, waitFor } from '@testing-library/react';

import { renderWithProviders, BookmarkTestComponent } from './test-utils';

import type { Folder } from '@/types';

const OLD_BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks';
const BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks_v2';

describe('BookmarkContext initial state', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with an empty array of folders', () => {
    renderWithProviders(<BookmarkTestComponent />);
    expect(screen.getByTestId('folders').textContent).toBe('[]');
  });

  it('migrates old bookmarks from localStorage', async () => {
    localStorage.setItem(OLD_BOOKMARKS_STORAGE_KEY, JSON.stringify(['1:1', '1:2']));

    renderWithProviders(<BookmarkTestComponent />);

    await waitFor(() => {
      const folders: Folder[] = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders).toHaveLength(1);
      expect(folders[0].name).toBe('Uncategorized');
      expect(folders[0].bookmarks.map((b) => b.verseId)).toEqual(['1:1', '1:2']);
      expect(localStorage.getItem(OLD_BOOKMARKS_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(BOOKMARKS_STORAGE_KEY)).toBeDefined();
    });
  });
});
