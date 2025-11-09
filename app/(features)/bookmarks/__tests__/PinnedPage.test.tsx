import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import PinnedAyahPage from '@/app/(features)/bookmarks/pinned/page';
import { PINNED_STORAGE_KEY } from '@/app/providers/bookmarks/constants';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { push } from '@/app/testUtils/mockRouter';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import * as chaptersApi from '@/lib/api/chapters';

import type { Verse } from '@/types';
// Router mocked via testUtils/mockRouter

jest.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => {
    const items = Array.from({ length: count }, (_, index) => ({
      key: `virtual-${index}`,
      index,
      start: index * 360,
    }));
    return {
      getVirtualItems: () => items,
      getTotalSize: () => count * 360,
      measureElement: jest.fn(),
    };
  },
}));

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

jest.mock('@/app/shared/hooks/useSingleVerse', () => {
  const prefetchMock = jest.fn().mockResolvedValue(undefined);
  return {
    useSingleVerse: jest.fn(),
    usePrefetchSingleVerse: () => prefetchMock,
  };
});

// Reduce render tree and memory by stubbing heavy reader components
jest.mock('@/app/shared/reader', () => ({
  ThreeColumnWorkspace: ({ left, center, right }: any) => (
    <div>
      <div data-testid="left-col">{left}</div>
      <div data-testid="center-col">{center}</div>
      <div data-testid="right-col">{right}</div>
    </div>
  ),
  WorkspaceMain: ({ children, ...props }: any) => {
    const { ['data-slot']: dataSlot, className, ...rest } = props;
    return (
      <div data-slot={dataSlot ?? 'bookmarks-landing-main'} className={className} {...rest}>
        {children}
      </div>
    );
  },
  // Render the primary translation text to match expectations
  ReaderVerseCard: ({ verse }: any) => (
    <div data-testid="reader-verse-card">{verse?.translations?.[0]?.text}</div>
  ),
}));

beforeAll(() => {
  setMatchMedia(false);
});

beforeEach(() => {
  (chaptersApi.getChapters as jest.Mock).mockResolvedValue([
    { id: 1, name_simple: 'Al-Fatihah', verses_count: 7 },
  ]);
  push.mockClear();
  const { useSingleVerse } = jest.requireMock('@/app/shared/hooks/useSingleVerse') as {
    useSingleVerse: jest.Mock;
  };
  useSingleVerse.mockReset();
  useSingleVerse.mockReturnValue({
    verse: undefined,
    isLoading: false,
    error: null,
    mutate: jest.fn(),
  });
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
      translations: [
        {
          resource_id: 20,
          text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        },
      ],
    };

    const { useSingleVerse } = jest.requireMock('@/app/shared/hooks/useSingleVerse') as {
      useSingleVerse: jest.Mock;
    };
    useSingleVerse.mockReturnValue({ verse, isLoading: false, error: null, mutate: jest.fn() });

    window.localStorage.setItem(
      PINNED_STORAGE_KEY,
      JSON.stringify([{ verseId: '1', createdAt: Date.now(), verseKey: '1:1' }])
    );

    renderWithProviders(<PinnedAyahPage />);

    expect(
      await screen.findByText(
        'In the name of Allah, the Entirely Merciful, the Especially Merciful.'
      )
    ).toBeInTheDocument();
    expect(useSingleVerse).toHaveBeenCalledWith({ idOrKey: '1' });
  });
});
