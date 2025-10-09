import { render } from '@testing-library/react';

import { BookmarkFolderClient } from '@/app/(features)/bookmarks/[folderId]/BookmarkFolderClient';
import { logger } from '@/src/infrastructure/monitoring/Logger';

const bookmarkFolderViewSpy = jest.fn();
const useBookmarkFolderControllerMock = jest.fn();

jest.mock('../components/BookmarkFolderView', () => ({
  BookmarkFolderView: (props: Record<string, unknown>) => {
    bookmarkFolderViewSpy(props);
    return <div data-testid="bookmark-folder-view" />;
  },
}));

jest.mock('../hooks/useBookmarkFolderController', () => ({
  useBookmarkFolderController: (folderId: string) => useBookmarkFolderControllerMock(folderId),
}));

const createControllerMock = () => ({
  folder: { id: '1', name: 'Test Folder', bookmarks: [] },
  bookmarks: [],
  isBookmarkSidebarOpen: false,
  setBookmarkSidebarOpen: jest.fn(),
  handleNavigateToBookmarks: jest.fn(),
  folderName: 'Test Folder',
  verses: [],
  loadingVerses: new Set<string>(),
  isTranslationPanelOpen: false,
  setIsTranslationPanelOpen: jest.fn(),
  isWordPanelOpen: false,
  setIsWordPanelOpen: jest.fn(),
  selectedTranslationName: 'English',
  selectedWordLanguageName: 'English',
});

describe('BookmarkFolderClient', () => {
  beforeEach(() => {
    bookmarkFolderViewSpy.mockClear();
    useBookmarkFolderControllerMock.mockReturnValue(createControllerMock());
  });

  it('logs render with folderId', () => {
    const debugSpy = jest.spyOn(logger, 'debug').mockImplementation(() => {});

    render(<BookmarkFolderClient folderId="1" />);

    expect(debugSpy).toHaveBeenCalledWith('BookmarkFolderClient rendering', {
      folderId: '1',
    });
    debugSpy.mockRestore();
  });

  it('forwards controller props to the view without layout flag', () => {
    render(<BookmarkFolderClient folderId="123" />);

    const props = bookmarkFolderViewSpy.mock.calls[0][0] as Record<string, unknown>;

    expect(props).toHaveProperty('folderName', 'Test Folder');
    expect(props).not.toHaveProperty('layout');
  });
});
