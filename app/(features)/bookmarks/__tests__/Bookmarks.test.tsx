import { render, screen } from '@testing-library/react';

import { BookmarksHeader } from '@/app/(features)/bookmarks/components/BookmarksHeader';
import { BookmarksSidebar } from '@/app/(features)/bookmarks/components/BookmarksSidebar';

import React from 'react';

const mockTag = (tag: string) => ({ children, ...props }: any) => React.createElement(tag, props, children);
type MockProps = { children?: React.ReactNode };

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
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

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const testNavigationItemAccessibility = (item: Element | null): void => {
  expect(item).toBeInTheDocument();
  if (item) {
    expect(item).toHaveClass('transition-colors');
  }
};

describe('BookmarksHeader', () => {
  const renderBookmarksHeader = (): {
    mockOnSidebarToggle: jest.Mock;
    mockOnNewFolderClick: jest.Mock;
    mockOnSearchChange: jest.Mock;
  } => {
    const mockOnSidebarToggle = jest.fn();
    const mockOnNewFolderClick = jest.fn();
    const mockOnSearchChange = jest.fn();

    render(
      <BookmarksHeader
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        onNewFolderClick={mockOnNewFolderClick}
        onSidebarToggle={mockOnSidebarToggle}
      />
    );

    return { mockOnSidebarToggle, mockOnNewFolderClick, mockOnSearchChange };
  };

  it('should render without errors', () => {
    renderBookmarksHeader();

    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('New Folder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Bookmarks')).toBeInTheDocument();
  });

  it('should have proper touch targets for buttons', () => {
    renderBookmarksHeader();
    const newFolderButton = screen.getByRole('button', { name: 'New Folder' });
    expect(newFolderButton).toHaveClass('min-h-touch');
  });

  it('should apply responsive classes consistently', () => {
    renderBookmarksHeader();
    const newFolderButton = screen.getByRole('button', { name: 'New Folder' });

    expect(newFolderButton).toHaveClass('touch-manipulation');
    expect(newFolderButton).toHaveClass('select-none');
  });
});

describe('BookmarksSidebar', () => {
  it('should render all navigation items', () => {
    render(<BookmarksSidebar activeSection="bookmarks" />);

    expect(screen.getByText('Bookmark')).toBeInTheDocument();
    expect(screen.getByText('Pins')).toBeInTheDocument();
    expect(screen.getByText('Last Reads')).toBeInTheDocument();
  });

  it('should have accessible navigation items', () => {
    render(<BookmarksSidebar activeSection="bookmarks" />);

    const pinnedItem = screen.getByText('Pins').closest('div');
    const lastReadItem = screen.getByText('Last Reads').closest('div');

    testNavigationItemAccessibility(pinnedItem);
    testNavigationItemAccessibility(lastReadItem);

    const bookmarkItem = screen.getByText('Bookmark');
    const navBookmarkItem = bookmarkItem.closest('div');
    expect(navBookmarkItem).toBeInTheDocument();
  });
});
