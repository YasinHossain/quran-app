import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders, BookmarkTestComponent } from './test-utils';

import type { Bookmark, Folder } from '@/types';

const BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks_v2';

const renderComponent = (): ReturnType<typeof renderWithProviders> =>
  renderWithProviders(<BookmarkTestComponent />);

const getFolders = (): Folder[] => JSON.parse(screen.getByTestId('folders').textContent || '[]');

const getPinned = (): Bookmark[] => JSON.parse(screen.getByTestId('pinned').textContent || '[]');

const getLastRead = (): Record<string, number> =>
  JSON.parse(screen.getByTestId('lastRead').textContent || '{}');

const getIsBookmarked = (): string => screen.getByTestId('is-bookmarked-1:1').textContent;

const getIsPinned = (): string => screen.getByTestId('is-pinned-1:1').textContent;

beforeEach(() => {
  localStorage.clear();
});

it('creates a new folder', async () => {
  renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await waitFor(() => {
    const folders = getFolders();
    expect(folders).toHaveLength(1);
    expect(folders[0].name).toBe('Test Folder');
  });
});

it('adds a bookmark to a folder', async () => {
  renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await userEvent.click(screen.getByText('Add Bookmark'));
  await waitFor(() => {
    const [folder] = getFolders();
    expect(folder.bookmarks).toHaveLength(1);
    expect(folder.bookmarks[0].verseId).toBe('1:1');
    expect(getIsBookmarked()).toBe('true');
  });
});

it('removes a bookmark from a folder', async () => {
  renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await userEvent.click(screen.getByText('Add Bookmark'));
  await userEvent.click(screen.getByText('Remove Bookmark'));
  await waitFor(() => {
    const [folder] = getFolders();
    expect(folder.bookmarks).toHaveLength(0);
    expect(getIsBookmarked()).toBe('false');
  });
});

it('renames a folder', async () => {
  renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await userEvent.click(screen.getByText('Rename Folder'));
  await waitFor(() => {
    const [folder] = getFolders();
    expect(folder.name).toBe('New Name');
  });
});

it('deletes a folder', async () => {
  renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await userEvent.click(screen.getByText('Delete Folder'));
  await waitFor(() => {
    expect(getFolders()).toHaveLength(0);
  });
});

it('persists folder color', async () => {
  renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await userEvent.click(screen.getByText('Set Color'));
  await waitFor(() => {
    const [folder] = getFolders();
    expect(folder.color).toBe('text-primary');
    const stored: Folder[] = JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE_KEY) || '[]');
    expect(stored[0].color).toBe('text-primary');
  });
});

describe('pin operations', () => {
  it('pins a verse', async () => {
    renderComponent();
    await userEvent.click(screen.getByText('Toggle Pin'));
    await waitFor(() => {
      expect(getPinned()).toHaveLength(1);
      expect(getIsPinned()).toBe('true');
    });
  });

  it('unpins a verse', async () => {
    renderComponent();
    await userEvent.click(screen.getByText('Toggle Pin'));
    await userEvent.click(screen.getByText('Toggle Pin'));
    await waitFor(() => {
      expect(getPinned()).toHaveLength(0);
      expect(getIsPinned()).toBe('false');
    });
  });
});

describe('last read', () => {
  it('sets last read verse', async () => {
    renderComponent();
    await userEvent.click(screen.getByText('Set Last Read'));
    await waitFor(() => {
      const last = getLastRead();
      expect(last['1']).toBe(1);
    });
  });
});
