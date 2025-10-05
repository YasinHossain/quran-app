import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProvidersAsync, BookmarkTestComponent } from './test-utils';

import type { Folder } from '@/types';

const BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks_v2';

const renderComponent = async (): Promise<ReturnType<typeof renderWithProvidersAsync>> => {
  const result = await renderWithProvidersAsync(<BookmarkTestComponent />);
  await waitFor(() => {
    expect(screen.getByTestId('folders')).toBeInTheDocument();
  });
  return result;
};

const getFolders = (): Folder[] => JSON.parse(screen.getByTestId('folders').textContent || '[]');

const getLastRead = (): Record<string, number> =>
  JSON.parse(screen.getByTestId('lastRead').textContent || '{}');

const getIsBookmarked = (): string => screen.getByTestId('is-bookmarked-1:1').textContent;

const getIsPinned = (): string => screen.getByTestId('is-pinned-1:1').textContent;

beforeEach(() => {
  localStorage.clear();
});

it('creates a new folder', async () => {
  await renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await waitFor(() => {
    const folders = getFolders();
    expect(folders).toHaveLength(1);
    const firstFolder = folders[0];
    if (!firstFolder) {
      throw new Error('Expected folder to exist when verifying creation');
    }
    expect(firstFolder.name).toBe('Test Folder');
  });
});

it('adds a bookmark to a folder', async () => {
  await renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await userEvent.click(screen.getByText('Add Bookmark'));
  await waitFor(() => {
    const [folder] = getFolders();
    if (!folder) {
      throw new Error('Expected folder to exist when verifying bookmark');
    }
    expect(folder.bookmarks).toHaveLength(1);
    const [bookmark] = folder.bookmarks;
    if (!bookmark) {
      throw new Error('Expected bookmark to exist after adding');
    }
    expect(bookmark.verseId).toBe('1:1');
    expect(getIsBookmarked()).toBe('true');
  });
});

it('removes a bookmark from a folder', async () => {
  await renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await userEvent.click(screen.getByText('Add Bookmark'));
  await userEvent.click(screen.getByText('Remove Bookmark'));
  await waitFor(() => {
    const [folder] = getFolders();
    if (!folder) {
      throw new Error('Expected folder to exist when verifying bookmark removal');
    }
    expect(folder.bookmarks).toHaveLength(0);
    expect(getIsBookmarked()).toBe('false');
  });
});

it('renames a folder', async () => {
  await renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await userEvent.click(screen.getByText('Rename Folder'));
  await waitFor(() => {
    const [folder] = getFolders();
    if (!folder) {
      throw new Error('Expected folder to exist when verifying rename');
    }
    expect(folder.name).toBe('New Name');
  });
});

it('deletes a folder', async () => {
  await renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await userEvent.click(screen.getByText('Delete Folder'));
  await waitFor(() => {
    expect(getFolders()).toHaveLength(0);
  });
});

it('persists folder color', async () => {
  await renderComponent();
  await userEvent.click(screen.getByText('Create Folder'));
  await userEvent.click(screen.getByText('Set Color'));
  await waitFor(() => {
    const [folder] = getFolders();
    if (!folder) {
      throw new Error('Expected folder to exist when verifying color');
    }
    expect(folder.color).toBe('text-primary');
    const stored: Folder[] = JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE_KEY) || '[]');
    const storedFolder = stored[0];
    if (!storedFolder) {
      throw new Error('Expected stored folder to exist when verifying color persistence');
    }
    expect(storedFolder.color).toBe('text-primary');
  });
});

describe('pin operations', () => {
  it('pins a verse', async () => {
    await renderComponent();
    await userEvent.click(screen.getByText('Toggle Pin'));
    await waitFor(() => {
      expect(getIsPinned()).toBe('true');
    });
  });

  it('unpins a verse', async () => {
    await renderComponent();
    await userEvent.click(screen.getByText('Toggle Pin'));
    await userEvent.click(screen.getByText('Toggle Pin'));
    await waitFor(() => {
      expect(getIsPinned()).toBe('false');
    });
  });
});

describe('last read', () => {
  it('sets last read verse', async () => {
    await renderComponent();
    await userEvent.click(screen.getByText('Set Last Read'));
    await waitFor(() => {
      const last = getLastRead();
      expect(last['1']).toBe(1);
    });
  });
});
