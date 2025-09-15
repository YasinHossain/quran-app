import { render, act } from '@testing-library/react';
import React from 'react';

import { BookmarkProvider, useBookmarks } from '@/app/providers/BookmarkContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import * as api from '@/lib/api';
import * as chaptersApi from '@/lib/api/chapters';

jest.mock('@/lib/api/chapters');
jest.mock('@/lib/api');

beforeEach(() => {
  (chaptersApi.getChapters as jest.Mock).mockResolvedValue([]);
  (api.getChapters as jest.Mock).mockResolvedValue([]);
  (api.getSurahList as jest.Mock).mockResolvedValue([]);
});

export const renderWithProviders = (ui: React.ReactElement): ReturnType<typeof render> =>
  render(
    <SettingsProvider>
      <BookmarkProvider>{ui}</BookmarkProvider>
    </SettingsProvider>
  );

export const renderWithProvidersAsync = async (
  ui: React.ReactElement
): Promise<ReturnType<typeof renderWithProviders>> => {
  let result: ReturnType<typeof renderWithProviders> | undefined;
  await act(async () => {
    result = renderWithProviders(ui);
  });
  return result!;
};

export const BookmarkTestComponent = (): React.JSX.Element => {
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
