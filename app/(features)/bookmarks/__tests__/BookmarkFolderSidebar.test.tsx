import { act, fireEvent, render, screen } from '@testing-library/react';
const mockRouter = { push: jest.fn(), query: {} };
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { BookmarkFolderSidebar } from '@/app/(features)/bookmarks/components/BookmarkFolderSidebar';

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/bookmarks/folder1',
  useSearchParams: () => new URLSearchParams(),
}));

const bookmarks = [
  { verseId: '1', verseKey: '1:1', surahName: 'Al-Fatihah', createdAt: 0 },
  { verseId: '2', verseKey: '2:255', surahName: 'Al-Baqarah', createdAt: 0 },
];

jest.mock('@/app/providers/BookmarkContext', () => ({
  useBookmarks: () => ({
    folders: [{ id: 'folder1', name: 'Folder 1', bookmarks }],
    chapters: [],
    updateBookmark: jest.fn(),
  }),
}));

jest.mock('../hooks/useBookmarkVerse', () => ({
  useBookmarkVerse: (bookmark: unknown) => ({ bookmark, isLoading: false, error: null }),
}));

jest.mock('@/app/(features)/layout/context/HeaderVisibilityContext', () => ({
  useHeaderVisibility: () => ({ isHidden: false }),
}));

describe('BookmarkFolderSidebar', () => {
  it('highlights active verse and handles verse selection', async () => {
    const handleVerseSelect = jest.fn();

    mockRouter.push('/bookmarks/folder1');

    await act(async () => {
      render(
        <AppRouterContext.Provider value={mockRouter as any}>
          <BookmarkFolderSidebar
            bookmarks={bookmarks}
            folder={{ id: 'folder1', name: 'Folder 1', bookmarks }}
            activeVerseId="1"
            onVerseSelect={handleVerseSelect}
            isOpen
            onClose={jest.fn()}
          />
        </AppRouterContext.Provider>
      );
    });

    const activeButton = screen.getByText('1:1').closest('button');
    expect(activeButton).toHaveClass('bg-accent/10');

    const secondButton = screen.getByText('2:255').closest('button') as HTMLButtonElement;
    await act(async () => {
      fireEvent.click(secondButton);
    });
    expect(handleVerseSelect).toHaveBeenCalledWith('2');
  });
});
