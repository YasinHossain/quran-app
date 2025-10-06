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
  handleVerseSelect: jest.fn(),
  handleNavigateToBookmarks: jest.fn(),
  isHidden: false,
  folderName: 'Test Folder',
  activeVerseId: undefined,
  verses: [],
  displayVerses: [],
  loadingVerses: new Set<string>(),
  isTranslationPanelOpen: false,
  setIsTranslationPanelOpen: jest.fn(),
  isWordPanelOpen: false,
  setIsWordPanelOpen: jest.fn(),
  selectedTranslationName: 'English',
  selectedWordLanguageName: 'English',
});

describe('BookmarkFolderClient', () => {
  const originalEnv = process.env['NEXT_PUBLIC_THREE_COLUMN_WORKSPACE'];

  beforeEach(() => {
    bookmarkFolderViewSpy.mockClear();
    useBookmarkFolderControllerMock.mockReturnValue(createControllerMock());
  });

  afterEach(() => {
    process.env['NEXT_PUBLIC_THREE_COLUMN_WORKSPACE'] = originalEnv;
  });

  it('logs render with folderId', () => {
    const debugSpy = jest.spyOn(logger, 'debug').mockImplementation(() => {});

    render(<BookmarkFolderClient folderId="1" />);

    expect(debugSpy).toHaveBeenCalledWith('BookmarkFolderClient rendering', {
      folderId: '1',
    });
    debugSpy.mockRestore();
  });

  it('passes workspace layout when flag is enabled', () => {
    process.env['NEXT_PUBLIC_THREE_COLUMN_WORKSPACE'] = 'true';

    render(<BookmarkFolderClient folderId="123" />);

    expect(bookmarkFolderViewSpy).toHaveBeenCalledWith(
      expect.objectContaining({ layout: 'workspace' })
    );
  });

  it('defaults to legacy layout when flag is disabled', () => {
    process.env['NEXT_PUBLIC_THREE_COLUMN_WORKSPACE'] = 'false';

    render(<BookmarkFolderClient folderId="123" />);

    expect(bookmarkFolderViewSpy).toHaveBeenCalledWith(
      expect.objectContaining({ layout: 'legacy' })
    );
  });
});
