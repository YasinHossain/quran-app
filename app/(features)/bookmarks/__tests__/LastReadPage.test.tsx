import React from 'react';

import LastReadPage from '@/app/(features)/bookmarks/last-read/page';
import { LAST_READ_STORAGE_KEY } from '@/app/providers/bookmarks/constants';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { push } from '@/app/testUtils/mockRouter';
import {
  renderWithProviders,
  screen,
  fireEvent,
  waitFor,
} from '@/app/testUtils/renderWithProviders';
import * as chaptersApi from '@/lib/api/chapters';
jest.mock('@/lib/api/chapters');

jest.mock('../components/BookmarksSidebar', () => ({
  BookmarksSidebar: ({ onSectionChange }: { onSectionChange: (section: string) => void }) => (
    <nav>
      <button onClick={() => onSectionChange('bookmarks')}>Bookmarks</button>
      <button onClick={() => onSectionChange('pinned')}>Pins</button>
      <button onClick={() => onSectionChange('last-read')}>Last Read</button>
    </nav>
  ),
}));

jest.mock('@/app/(features)/layout/context/HeaderVisibilityContext', () => ({
  useHeaderVisibility: () => ({ isHidden: false }),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: (args: any) => {
      const { children, ...props } = args;
      delete (props as any).whileHover;
      delete (props as any).whileTap;
      return React.createElement('div', props, children);
    },
    aside: (args: any) => {
      const { children, ...props } = args;
      delete (props as any).whileHover;
      delete (props as any).whileTap;
      return React.createElement('aside', props, children);
    },
    button: (args: any) => {
      const { children, ...props } = args;
      delete (props as any).whileHover;
      delete (props as any).whileTap;
      return React.createElement('button', props, children);
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

beforeAll(() => {
  setMatchMedia(false);
});

beforeEach(() => {
  (chaptersApi.getChapters as jest.Mock).mockResolvedValue([
    { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
  ]);
  if (typeof window !== 'undefined') {
    (window as any).__TEST_BOOKMARK_CHAPTERS__ = [
      { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
    ];
  }
  localStorage.clear();
  localStorage.setItem(LAST_READ_STORAGE_KEY, JSON.stringify({ '1': 3 }));
  push.mockClear();
});

describe('Last Read Page', () => {
  it('renders last read progress and handles navigation', async () => {
    renderWithProviders(<LastReadPage />);
    expect(await screen.findByRole('heading', { name: 'Recent' })).toBeInTheDocument();
    expect(await screen.findByText(/Verse 3 of 7/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Pins'));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/bookmarks/pinned'));
  });

  it('shows empty state message', async () => {
    localStorage.setItem(LAST_READ_STORAGE_KEY, JSON.stringify({}));
    renderWithProviders(<LastReadPage />);
    expect(await screen.findByText('No Recent Activity')).toBeInTheDocument();
  });
});
