import { render, screen } from '@testing-library/react';
import { BookmarksHeader } from '../components/BookmarksHeader';
import { BookmarksSidebar } from '../components/BookmarksSidebar';

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

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
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

describe('Bookmarks Responsive Components', () => {
  describe('BookmarksHeader', () => {
    it('should render without errors', () => {
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

      expect(screen.getByText('Bookmarks')).toBeInTheDocument();
      expect(screen.getByText('New Folder')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search Bookmarks')).toBeInTheDocument();
    });

    it('should have proper touch targets for buttons', () => {
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

      const newFolderButton = screen.getByRole('button', { name: 'New Folder' });

      // Check touch target size (minimum 44px per WCAG)
      expect(newFolderButton).toHaveClass('min-h-touch');
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

      // Since there's no onClick handler, the ListItem renders as div
      const pinnedItem = screen.getByText('Pins').closest('div');
      const lastReadItem = screen.getByText('Last Reads').closest('div');

      // Check that all items are properly accessible
      [pinnedItem, lastReadItem].forEach((item) => {
        expect(item).toBeInTheDocument();
        if (item) {
          // These should have proper styling even if not clickable in this context
          expect(item).toHaveClass('transition-colors');
        }
      });

      // Check the bookmark item is active
      const bookmarkItem = screen.getByText('Bookmark');
      const navBookmarkItem = bookmarkItem.closest('div');
      expect(navBookmarkItem).toBeInTheDocument();
    });
  });

  describe('Responsive Design System', () => {
    it('should apply responsive classes consistently', () => {
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

      const newFolderButton = screen.getByRole('button', { name: 'New Folder' });

      // Verify responsive classes are applied
      expect(newFolderButton).toHaveClass('touch-manipulation');
      expect(newFolderButton).toHaveClass('select-none');
    });
  });
});
