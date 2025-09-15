import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import PinnedAyahPage from '@/app/(features)/bookmarks/pinned/page';
import { PINNED_STORAGE_KEY } from '@/app/providers/bookmarks/constants';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import * as chaptersApi from '@/lib/api/chapters';

jest.mock('@/lib/api/chapters');

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
  setMatchMedia(false);
});

beforeEach(() => {
  localStorage.clear();
  (chaptersApi.getChapters as jest.Mock).mockResolvedValue([
    { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
  ]);
  push.mockClear();
});

describe('Pinned Ayah Page', () => {
  it('renders pinned verses and handles navigation', async () => {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify([{ verseId: '1', createdAt: 0 }]));
    renderWithProviders(<PinnedAyahPage />);

    expect(await screen.findByText('Pinned Ayahs')).toBeInTheDocument();
    expect(await screen.findByText('Verse 1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Last Read'));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/bookmarks/last-read'));
  });

  it('removes a pinned verse', async () => {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify([{ verseId: '1', createdAt: 0 }]));
    renderWithProviders(<PinnedAyahPage />);
    await screen.findByText('Verse 1');
    fireEvent.click(screen.getByText('Remove'));
    await waitFor(() => {
      expect(screen.queryByText('Verse 1')).not.toBeInTheDocument();
    });
  });

  it('shows empty state message', async () => {
    renderWithProviders(<PinnedAyahPage />);
    expect(await screen.findByText('No Pinned Verses')).toBeInTheDocument();
  });
});
