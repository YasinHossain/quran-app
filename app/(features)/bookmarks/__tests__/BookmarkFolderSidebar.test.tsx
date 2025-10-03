import { act, fireEvent, render, screen } from '@testing-library/react';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { BookmarkFolderSidebar } from '@/app/(features)/bookmarks/components/BookmarkFolderSidebar';

const mockRouter = { push: jest.fn(), query: {} };

(useRouter as jest.Mock).mockReturnValue(mockRouter);
(usePathname as jest.Mock).mockReturnValue('/bookmarks/folder1');
(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

const bookmarks = [
  { verseId: '1', verseKey: '1:1', surahName: 'Al-Fatihah', createdAt: 0 },
  { verseId: '2', verseKey: '2:255', surahName: 'Al-Baqarah', createdAt: 0 },
];

jest.mock('@/app/providers/BookmarkContext', () => ({
  useBookmarks: () => ({
    folders: [{ id: 'folder1', name: 'Folder 1', bookmarks, createdAt: 0 }],
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
            folder={{ id: 'folder1', name: 'Folder 1', bookmarks, createdAt: 0 }}
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
