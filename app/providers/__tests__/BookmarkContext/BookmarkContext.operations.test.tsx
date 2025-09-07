import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders, BookmarkTestComponent } from './test-utils';

import type { Folder } from '@/types';

const BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks_v2';

describe('BookmarkContext operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a new folder', async () => {
    renderWithProviders(<BookmarkTestComponent />);
    await userEvent.click(screen.getByText('Create Folder'));
    await waitFor(() => {
      const folders = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders).toHaveLength(1);
      expect(folders[0].name).toBe('Test Folder');
    });
  });

  it('adds a bookmark to a folder', async () => {
    renderWithProviders(<BookmarkTestComponent />);
    await userEvent.click(screen.getByText('Create Folder'));
    await userEvent.click(screen.getByText('Add Bookmark'));
    await waitFor(() => {
      const folders: Folder[] = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders[0].bookmarks).toHaveLength(1);
      expect(folders[0].bookmarks[0].verseId).toBe('1:1');
      expect(screen.getByTestId('is-bookmarked-1:1').textContent).toBe('true');
    });
  });

  it('removes a bookmark from a folder', async () => {
    renderWithProviders(<BookmarkTestComponent />);
    await userEvent.click(screen.getByText('Create Folder'));
    await userEvent.click(screen.getByText('Add Bookmark'));
    await userEvent.click(screen.getByText('Remove Bookmark'));
    await waitFor(() => {
      const folders: Folder[] = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders[0].bookmarks).toHaveLength(0);
      expect(screen.getByTestId('is-bookmarked-1:1').textContent).toBe('false');
    });
  });

  it('renames a folder', async () => {
    renderWithProviders(<BookmarkTestComponent />);
    await userEvent.click(screen.getByText('Create Folder'));
    await userEvent.click(screen.getByText('Rename Folder'));
    await waitFor(() => {
      const folders: Folder[] = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders[0].name).toBe('New Name');
    });
  });

  it('deletes a folder', async () => {
    renderWithProviders(<BookmarkTestComponent />);
    await userEvent.click(screen.getByText('Create Folder'));
    await userEvent.click(screen.getByText('Delete Folder'));
    await waitFor(() => {
      expect(screen.getByTestId('folders').textContent).toBe('[]');
    });
  });

  it('pins and unpins a verse', async () => {
    renderWithProviders(<BookmarkTestComponent />);
    await userEvent.click(screen.getByText('Toggle Pin'));
    await waitFor(() => {
      const pinned = JSON.parse(screen.getByTestId('pinned').textContent || '[]');
      expect(pinned).toHaveLength(1);
      expect(screen.getByTestId('is-pinned-1:1').textContent).toBe('true');
    });
    await userEvent.click(screen.getByText('Toggle Pin'));
    await waitFor(() => {
      const pinned = JSON.parse(screen.getByTestId('pinned').textContent || '[]');
      expect(pinned).toHaveLength(0);
      expect(screen.getByTestId('is-pinned-1:1').textContent).toBe('false');
    });
  });

  it('sets last read verse', async () => {
    renderWithProviders(<BookmarkTestComponent />);
    await userEvent.click(screen.getByText('Set Last Read'));
    await waitFor(() => {
      const last = JSON.parse(screen.getByTestId('lastRead').textContent || '{}');
      expect(last['1']).toBe(1);
    });
  });

  it('persists folder color', async () => {
    renderWithProviders(<BookmarkTestComponent />);
    await userEvent.click(screen.getByText('Create Folder'));
    await userEvent.click(screen.getByText('Set Color'));
    await waitFor(() => {
      const folders: Folder[] = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders[0].color).toBe('text-primary');
      const stored: Folder[] = JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE_KEY) || '[]');
      expect(stored[0].color).toBe('text-primary');
    });
  });
});
