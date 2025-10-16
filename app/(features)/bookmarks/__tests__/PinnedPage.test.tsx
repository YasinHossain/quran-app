import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import PinnedAyahPage from '@/app/(features)/bookmarks/pinned/page';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { push } from '@/app/testUtils/mockRouter';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { PINNED_STORAGE_KEY } from '@/app/providers/bookmarks/constants';
import * as chaptersApi from '@/lib/api/chapters';
import type { Verse } from '@/types';
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

jest.mock('@/app/(features)/surah/components/surah-view/SurahWorkspaceSettings', () => ({
  SurahWorkspaceSettings: () => <aside data-testid="surah-settings-sidebar" />,
}));

jest.mock('@/app/(features)/bookmarks/pinned/components/PinnedSettingsSidebar', () => ({
  PinnedSettingsSidebar: () => <div data-testid="mobile-settings-sidebar" />,
}));

jest.mock('@/app/(features)/bookmarks/[folderId]/hooks', () => {
  const actual = jest.requireActual('@/app/(features)/bookmarks/[folderId]/hooks');
  return {
    ...actual,
    useBookmarkFolderPanels: () => ({
      isTranslationPanelOpen: false,
      setIsTranslationPanelOpen: jest.fn(),
      isWordPanelOpen: false,
      setIsWordPanelOpen: jest.fn(),
      selectedTranslationName: 'English',
      selectedWordLanguageName: 'English',
    }),
  };
});

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

jest.mock('@/app/(features)/bookmarks/hooks/verseCache', () => ({
  getVerseWithCache: jest.fn(),
}));

beforeAll(() => {
  setMatchMedia(false);
});

beforeEach(() => {
  (chaptersApi.getChapters as jest.Mock).mockResolvedValue([
    { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
  ]);
  push.mockClear();
  const { getVerseWithCache } = jest.requireMock('@/app/(features)/bookmarks/hooks/verseCache') as {
    getVerseWithCache: jest.Mock;
  };
  getVerseWithCache.mockReset();
  window.localStorage.clear();
  (window as any).__TEST_BOOKMARK_CHAPTERS__ = [
    {
      id: 1,
      name_simple: 'Al-Fatihah',
      name_arabic: 'الفاتحة',
      verses_count: 7,
      revelation_place: 'makkah',
    },
  ];
});

afterEach(() => {
  delete (window as any).__TEST_BOOKMARK_CHAPTERS__;
});

describe('Pinned Ayah Page', () => {
  it('shows empty state and handles navigation', async () => {
    renderWithProviders(<PinnedAyahPage />);

    expect(await screen.findByText('Pinned Verses')).toBeInTheDocument();
    expect(await screen.findByText('No Pinned Verses')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Last Read'));
    await waitFor(() => expect(push).toHaveBeenCalledWith('/bookmarks/last-read'));
  });

  it('renders pinned verses using ReaderVerseCard', async () => {
    const verse: Verse = {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      translations: [{ resource_id: 20, text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' }],
    };

    const { getVerseWithCache } = jest.requireMock('@/app/(features)/bookmarks/hooks/verseCache') as {
      getVerseWithCache: jest.Mock;
    };
    getVerseWithCache.mockResolvedValue(verse);

    window.localStorage.setItem(
      PINNED_STORAGE_KEY,
      JSON.stringify([{ verseId: '1', createdAt: Date.now(), verseKey: '1:1' }])
    );

    renderWithProviders(<PinnedAyahPage />);

    expect(await screen.findByText('In the name of Allah, the Entirely Merciful, the Especially Merciful.')).toBeInTheDocument();
    expect(getVerseWithCache).toHaveBeenCalledWith('1', expect.any(Number), expect.any(Array));
  });
});
