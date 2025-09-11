import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import PinnedAyahPage from '@/app/(features)/bookmarks/pinned/page';

const mockTag =
  (tag: string) =>
  ({ children, ...props }: any) =>
    React.createElement(tag, props, children);
type MockProps = { children?: React.ReactNode };

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

jest.mock('../components/BookmarksSidebar', () => ({
  BookmarksSidebar: ({ onSectionChange }: { onSectionChange: (section: string) => void }) => (
    <nav>
      <button onClick={() => onSectionChange('bookmarks')}>Bookmarks</button>
      <button onClick={() => onSectionChange('last-read')}>Last Read</button>
      <button onClick={() => onSectionChange('pinned')}>Pins</button>
    </nav>
  ),
}));

const removeBookmark = jest.fn();
let pinnedVerses = [{ verseId: '1', createdAt: 0 }];

jest.mock('@/app/providers/BookmarkContext', () => ({
  useBookmarks: () => ({
    pinnedVerses,
    removeBookmark,
    chapters: [
      { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
      { id: 2, name_simple: 'Al-Baqarah', verses_count: 286 },
    ],
  }),
}));

jest.mock('@/app/(features)/layout/context/HeaderVisibilityContext', () => ({
  useHeaderVisibility: () => ({ isHidden: false }),
}));

jest.mock('../components/BookmarkCard', () => ({
  BookmarkCard: ({ bookmark }: { bookmark: { verseId: string } }) => {
    const { removeBookmark } = require('@/app/providers/BookmarkContext').useBookmarks();
    return (
      <div>
        <span>{`Verse ${bookmark.verseId}`}</span>
        <button onClick={() => removeBookmark(bookmark.verseId, 'pinned')}>Remove</button>
      </div>
    );
  },
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    aside: ({ children, ...props }: any) => React.createElement('aside', props, children),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

beforeEach(() => {
  pinnedVerses = [{ verseId: '1', createdAt: 0 }];
  push.mockClear();
  removeBookmark.mockClear();
});

describe('Pinned Ayah Page', () => {
  it('renders pinned verses and handles navigation', () => {
    render(<PinnedAyahPage />);
    expect(screen.getByText('Pinned Ayahs')).toBeInTheDocument();
    expect(screen.getByText('Verse 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Last Read'));
    expect(push).toHaveBeenCalledWith('/bookmarks/last-read');
  });

  it('removes a pinned verse', () => {
    render(<PinnedAyahPage />);
    fireEvent.click(screen.getByText('Remove'));
    expect(removeBookmark).toHaveBeenCalledWith('1', 'pinned');
  });

  it('shows empty state message', () => {
    pinnedVerses = [];
    render(<PinnedAyahPage />);
    expect(screen.getByText('No Pinned Verses')).toBeInTheDocument();
  });
});
