import { act, render, screen } from '@testing-library/react';
import React from 'react';

import { BookmarksHeader } from '@/app/(features)/bookmarks/components/BookmarksHeader';
import { BookmarksSidebar } from '@/app/(features)/bookmarks/components/BookmarksSidebar';
import { setMatchMedia } from '@/app/testUtils/matchMedia';

const mockTag =
  (tag: string) =>
  ({ children, ...props }: Record<string, unknown>) =>
    React.createElement(tag, props, children);
type MockProps = { children?: React.ReactNode };

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) =>
      React.createElement('div', props, children),
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

// Mock the BookmarkContext
jest.mock('@/app/providers/BookmarkContext', () => ({
  useBookmarks: () => ({
    folders: [
      { id: '1', name: 'Test Folder 1', bookmarks: [] },
      { id: '2', name: 'Test Folder 2', bookmarks: [] },
    ],
    chapters: [
      { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
      { id: 2, name_simple: 'Al-Baqarah', verses_count: 286 },
    ],
  }),
}));

// Set up matchMedia mock
setMatchMedia(false);

const testNavigationItemAccessibility = (item: Element | null): void => {
  expect(item).toBeInTheDocument();
  if (item) {
    expect(item).toHaveClass('transition-colors');
  }
};

describe('BookmarksHeader', () => {
  const renderBookmarksHeader = async (): Promise<{
    mockOnSidebarToggle: jest.Mock;
    mockOnNewFolderClick: jest.Mock;
    mockOnSearchChange: jest.Mock;
  }> => {
    const mockOnSidebarToggle = jest.fn();
    const mockOnNewFolderClick = jest.fn();
    const mockOnSearchChange = jest.fn();

    await act(async () => {
      render(
        <BookmarksHeader
          searchTerm=""
          onSearchChange={mockOnSearchChange}
          onNewFolderClick={mockOnNewFolderClick}
          onSidebarToggle={mockOnSidebarToggle}
        />
      );
    });

    return { mockOnSidebarToggle, mockOnNewFolderClick, mockOnSearchChange };
  };

  it('should render without errors', async () => {
    await renderBookmarksHeader();

    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('New Folder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Bookmarks')).toBeInTheDocument();
  });

  it('should have proper touch targets for buttons', async () => {
    await renderBookmarksHeader();
    const newFolderButton = screen.getByRole('button', { name: 'New Folder' });
    expect(newFolderButton).toHaveClass('min-h-touch');
  });

  it('should apply responsive classes consistently', async () => {
    await renderBookmarksHeader();
    const newFolderButton = screen.getByRole('button', { name: 'New Folder' });

    expect(newFolderButton).toHaveClass('touch-manipulation');
    expect(newFolderButton).toHaveClass('select-none');
  });
});

describe('BookmarksSidebar', () => {
  it('should render all navigation items', async () => {
    await act(async () => {
      render(<BookmarksSidebar activeSection="bookmarks" />);
    });

    expect(screen.getByText('All Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('Pinned Verses')).toBeInTheDocument();
    expect(screen.getByText('Recent')).toBeInTheDocument();
  });

  it('should have accessible navigation items', async () => {
    await act(async () => {
      render(<BookmarksSidebar activeSection="bookmarks" />);
    });

    const pinnedItem = screen.getByText('Pinned Verses').closest('div');
    const lastReadItem = screen.getByText('Recent').closest('div');

    testNavigationItemAccessibility(pinnedItem);
    testNavigationItemAccessibility(lastReadItem);

    const bookmarkItem = screen.getByText('All Bookmarks');
    const navBookmarkItem = bookmarkItem.closest('div');
    expect(navBookmarkItem).toBeInTheDocument();
  });
});
