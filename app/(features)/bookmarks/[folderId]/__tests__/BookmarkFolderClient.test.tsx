import { render } from '@testing-library/react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

import { BookmarkFolderClient } from '../BookmarkFolderClient';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/app/(features)/layout/context/HeaderVisibilityContext', () => ({
  useHeaderVisibility: () => ({ isHidden: false }),
}));

jest.mock('@/app/providers/SidebarContext', () => ({
  useSidebar: () => ({ isBookmarkSidebarOpen: false, setBookmarkSidebarOpen: jest.fn() }),
}));

jest.mock('@/app/(features)/surah/components', () => ({
  SettingsSidebar: () => <div />,
}));

jest.mock('../components/BookmarkFolderSidebar', () => ({
  BookmarkFolderSidebar: () => <div />,
}));

jest.mock('../components/BookmarkVerseList', () => ({
  BookmarkVerseList: () => <div />,
}));

jest.mock('../hooks', () => ({
  useBookmarkFolderData: () => ({
    folder: { name: 'Test Folder' },
    bookmarks: [],
    verses: [],
    loadingVerses: new Set(),
  }),
  useBookmarkFolderPanels: () => ({
    isTranslationPanelOpen: false,
    setIsTranslationPanelOpen: jest.fn(),
    isWordPanelOpen: false,
    setIsWordPanelOpen: jest.fn(),
    selectedTranslationName: '',
    selectedWordLanguageName: '',
  }),
}));

describe('BookmarkFolderClient logging', () => {
  it('logs render with folderId', () => {
    const debugSpy = jest.spyOn(logger, 'debug').mockImplementation(() => {});

    render(<BookmarkFolderClient folderId="1" />);

    expect(debugSpy).toHaveBeenCalledWith('BookmarkFolderClient rendering', {
      folderId: '1',
    });
    debugSpy.mockRestore();
  });
});
