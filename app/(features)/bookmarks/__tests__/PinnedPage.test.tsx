import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { push } from '@/app/testUtils/mockRouter';
import PinnedAyahPage from '@/app/(features)/bookmarks/pinned/page';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import * as chaptersApi from '@/lib/api/chapters';
// Router mocked via testUtils/mockRouter

jest.mock('@/lib/api/chapters');
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
  (chaptersApi.getChapters as jest.Mock).mockResolvedValue([
    { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
  ]);
  push.mockClear();
});

describe('Pinned Ayah Page', () => {
  it('shows empty state and handles navigation', async () => {
    renderWithProviders(<PinnedAyahPage />);

    expect(await screen.findByText('Pinned Verses')).toBeInTheDocument();
    expect(await screen.findByText('No Pinned Verses')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Last Read'));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/bookmarks/last-read'));
  });
});
