import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LastReadPage from '../last-read/page';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

jest.mock('../components/BookmarksSidebar', () => ({
  BookmarksSidebar: ({ onSectionChange }: any) => (
    <nav>
      <button onClick={() => onSectionChange('bookmarks')}>Bookmarks</button>
      <button onClick={() => onSectionChange('pinned')}>Pins</button>
      <button onClick={() => onSectionChange('last-read')}>Last Read</button>
    </nav>
  ),
}));

let lastRead: Record<string, number> = { '1': 3 };

jest.mock('@/app/providers/BookmarkContext', () => ({
  useBookmarks: () => ({
    lastRead,
  }),
}));

jest.mock('@/app/(features)/layout/context/HeaderVisibilityContext', () => ({
  useHeaderVisibility: () => ({ isHidden: false }),
}));

const mockGetChapters = jest.fn();

jest.mock('@/lib/api/chapters', () => ({
  getChapters: () => mockGetChapters(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
  },
  AnimatePresence: ({ children }: any) => children,
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
  push.mockClear();
  mockGetChapters.mockResolvedValue([
    { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
  ]);
  lastRead = { '1': 3 };
});

describe('Last Read Page', () => {
  it('renders last read progress and handles navigation', async () => {
    render(<LastReadPage />);
    expect(
      await screen.findByRole('heading', { name: 'Last Read' })
    ).toBeInTheDocument();
    expect(await screen.findByText(/Verse 3 of 7/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Pins'));
    expect(push).toHaveBeenCalledWith('/bookmarks/pinned');
  });

  it('shows empty state message', async () => {
    lastRead = {};
    render(<LastReadPage />);
    expect(await screen.findByText('No Recent Activity')).toBeInTheDocument();
  });
});

