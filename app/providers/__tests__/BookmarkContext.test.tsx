import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookmarkProvider, useBookmarks } from '@/app/providers/BookmarkContext';
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
  } = useBookmarks();

  return (
    <div>
      <div data-testid="folders">{JSON.stringify(folders)}</div>
      <div data-testid="is-bookmarked-1:1">{isBookmarked('1:1') ? 'true' : 'false'}</div>

      <button onClick={() => createFolder('Test Folder')}>Create Folder</button>
      <button onClick={() => addBookmark('1:1', folders[0]?.id)}>Add Bookmark</button>
      <button onClick={() => removeBookmark('1:1', folders[0]?.id)}>Remove Bookmark</button>
      <button onClick={() => renameFolder(folders[0]?.id, 'New Name')}>Rename Folder</button>
      <button onClick={() => deleteFolder(folders[0]?.id)}>Delete Folder</button>
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
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
    );
    expect(screen.getByTestId('folders').textContent).toBe('[]');
  });

  it('should create a new folder', async () => {
    render(
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
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
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
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
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
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
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
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
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
    );
    await userEvent.click(screen.getByText('Create Folder'));
    await userEvent.click(screen.getByText('Delete Folder'));

    await waitFor(() => {
      expect(screen.getByTestId('folders').textContent).toBe('[]');
    });
  });

  it('should migrate old bookmarks from localStorage', async () => {
    // Set up the old bookmarks format in localStorage
    localStorage.setItem(OLD_BOOKMARKS_STORAGE_KEY, JSON.stringify(['1:1', '1:2']));

    render(
      <BookmarkProvider>
        <BookmarkTestComponent />
      </BookmarkProvider>
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
});
