import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookmarkProvider, useBookmarks } from '@/app/providers/BookmarkContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { Folder } from '@/types';

// A more comprehensive test component to interact with the new context features
const BookmarkTestComponent = () => {
  const {
    folders,
    createFolder,
    addBookmark,
    removeBookmark,
    renameFolder,
    deleteFolder,
    isBookmarked,
    pinnedVerses,
    togglePinned,
    isPinned,
    lastRead,
    setLastRead,
  } = useBookmarks();

  return (
    <div>
      <div data-testid="folders">{JSON.stringify(folders)}</div>
      <div data-testid="pinned">{JSON.stringify(pinnedVerses)}</div>
      <div data-testid="lastRead">{JSON.stringify(lastRead)}</div>
      <div data-testid="is-bookmarked-1:1">{isBookmarked('1:1') ? 'true' : 'false'}</div>
      <div data-testid="is-pinned-1:1">{isPinned('1:1') ? 'true' : 'false'}</div>

      <button onClick={() => createFolder('Test Folder')}>Create Folder</button>
      <button onClick={() => addBookmark('1:1', folders[0]?.id)}>Add Bookmark</button>
      <button onClick={() => removeBookmark('1:1', folders[0]?.id)}>Remove Bookmark</button>
      <button onClick={() => renameFolder(folders[0]?.id, 'New Name')}>Rename Folder</button>
      <button onClick={() => renameFolder(folders[0]?.id, folders[0]?.name || '', 'text-primary')}>
        Set Color
      </button>
      <button onClick={() => deleteFolder(folders[0]?.id)}>Delete Folder</button>
      <button onClick={() => togglePinned('1:1')}>Toggle Pin</button>
      <button onClick={() => setLastRead('1', 1)}>Set Last Read</button>
    </div>
  );
};

const OLD_BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks';
const BOOKMARKS_STORAGE_KEY = 'quranAppBookmarks_v2';

describe('BookmarkContext with Folders', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with an empty array of folders', () => {
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkTestComponent />
        </BookmarkProvider>
      </SettingsProvider>
    );
    expect(screen.getByTestId('folders').textContent).toBe('[]');
  });

  it('should create a new folder', async () => {
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkTestComponent />
        </BookmarkProvider>
      </SettingsProvider>
    );
    await userEvent.click(screen.getByText('Create Folder'));
    await waitFor(() => {
      const folders = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders).toHaveLength(1);
      expect(folders[0].name).toBe('Test Folder');
    });
  });

  it('should add a bookmark to a folder', async () => {
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkTestComponent />
        </BookmarkProvider>
      </SettingsProvider>
    );
    // First, create a folder
    await userEvent.click(screen.getByText('Create Folder'));
    // Then, add a bookmark to it
    await userEvent.click(screen.getByText('Add Bookmark'));

    await waitFor(() => {
      const folders: Folder[] = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders[0].bookmarks).toHaveLength(1);
      expect(folders[0].bookmarks[0].verseId).toBe('1:1');
      expect(screen.getByTestId('is-bookmarked-1:1').textContent).toBe('true');
    });
  });

  it('should remove a bookmark from a folder', async () => {
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkTestComponent />
        </BookmarkProvider>
      </SettingsProvider>
    );
    // Setup: create folder and add bookmark
    await userEvent.click(screen.getByText('Create Folder'));
    await userEvent.click(screen.getByText('Add Bookmark'));

    // Test: remove the bookmark
    await userEvent.click(screen.getByText('Remove Bookmark'));

    await waitFor(() => {
      const folders: Folder[] = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders[0].bookmarks).toHaveLength(0);
      expect(screen.getByTestId('is-bookmarked-1:1').textContent).toBe('false');
    });
  });

  it('should rename a folder', async () => {
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkTestComponent />
        </BookmarkProvider>
      </SettingsProvider>
    );
    await userEvent.click(screen.getByText('Create Folder'));
    await userEvent.click(screen.getByText('Rename Folder'));

    await waitFor(() => {
      const folders: Folder[] = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders[0].name).toBe('New Name');
    });
  });

  it('should delete a folder', async () => {
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkTestComponent />
        </BookmarkProvider>
      </SettingsProvider>
    );
    await userEvent.click(screen.getByText('Create Folder'));
    await userEvent.click(screen.getByText('Delete Folder'));

    await waitFor(() => {
      expect(screen.getByTestId('folders').textContent).toBe('[]');
    });
  });

  it('should pin and unpin a verse', async () => {
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkTestComponent />
        </BookmarkProvider>
      </SettingsProvider>
    );
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

  it('should set last read verse', async () => {
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkTestComponent />
        </BookmarkProvider>
      </SettingsProvider>
    );
    await userEvent.click(screen.getByText('Set Last Read'));
    await waitFor(() => {
      const last = JSON.parse(screen.getByTestId('lastRead').textContent || '{}');
      expect(last['1']).toBe(1);
    });
  });

  it('should migrate old bookmarks from localStorage', async () => {
    // Set up the old bookmarks format in localStorage
    localStorage.setItem(OLD_BOOKMARKS_STORAGE_KEY, JSON.stringify(['1:1', '1:2']));

    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkTestComponent />
        </BookmarkProvider>
      </SettingsProvider>
    );

    await waitFor(() => {
      const folders: Folder[] = JSON.parse(screen.getByTestId('folders').textContent || '[]');
      expect(folders).toHaveLength(1);
      expect(folders[0].name).toBe('Uncategorized');
      expect(folders[0].bookmarks).toHaveLength(2);
      expect(folders[0].bookmarks.map((b) => b.verseId)).toEqual(['1:1', '1:2']);

      // Check that the old key has been removed
      expect(localStorage.getItem(OLD_BOOKMARKS_STORAGE_KEY)).toBeNull();
      // Check that the new key has been set
      expect(localStorage.getItem(BOOKMARKS_STORAGE_KEY)).toBeDefined();
    });
  });

  it('should persist folder color', async () => {
    render(
      <SettingsProvider>
        <BookmarkProvider>
          <BookmarkTestComponent />
        </BookmarkProvider>
      </SettingsProvider>
    );

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
