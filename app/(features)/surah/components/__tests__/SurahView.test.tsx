import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/app/testUtils/renderWithProviders';
import SurahView from '../SurahView.client';

// Mock i18n to return keys directly
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Stable matchMedia for responsive utilities in JSDOM
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

// Mock panels hook to keep panels closed by default
jest.mock('@/app/(features)/surah/hooks', () => {
  const actual = jest.requireActual('@/app/(features)/surah/hooks');
  return {
    ...actual,
    useSurahPanels: () => ({
      isTranslationPanelOpen: false,
      openTranslationPanel: jest.fn(),
      closeTranslationPanel: jest.fn(),
      isWordLanguagePanelOpen: false,
      openWordLanguagePanel: jest.fn(),
      closeWordLanguagePanel: jest.fn(),
      selectedTranslationName: 'Sahih International',
      selectedWordLanguageName: 'English',
    }),
  };
});

// Mock verse listing to provide deterministic data
jest.mock('@/app/(features)/surah/hooks/useVerseListing', () => ({
  __esModule: true,
  default: () => ({
    error: null,
    isLoading: false,
    verses: [
      {
        id: 1,
        verse_key: '1:1',
        words: [],
        translations: [],
      },
    ],
    isValidating: false,
    isReachingEnd: true,
    loadMoreRef: { current: null },
    translationOptions: [],
    wordLanguageOptions: [],
    wordLanguageMap: {},
    settings: { translationFontSize: 16 },
    setSettings: jest.fn(),
    activeVerse: null,
    reciter: { id: 1, name: 'Reciter', path: 'reciter' },
    isPlayerVisible: false,
    handleNext: jest.fn(),
    handlePrev: jest.fn(),
  }),
}));

describe('SurahView (Week 6 architecture-compliant tests)', () => {
  it('renders with mobile-first responsive classes', () => {
    renderWithProviders(<SurahView surahId="1" />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('h-screen');
    expect(main).toHaveClass('overflow-hidden');
    expect(main).toHaveClass('lg:mr-[20.7rem]');

    // Scroll container inside main
    const scrollContainer = document.querySelector('main .overflow-y-auto') as HTMLElement | null;
    expect(scrollContainer).not.toBeNull();
    expect(scrollContainer!).toHaveClass('px-4');
    expect(scrollContainer!).toHaveClass('sm:px-6');
    expect(scrollContainer!).toHaveClass('lg:px-8');
    expect(scrollContainer!).toHaveClass('pb-6');

    // Header visible by default adds padding top via calc()
    expect(scrollContainer!.className).toContain('pt-[calc(3.5rem+env(safe-area-inset-top))]');
  });

  it('integrates with required providers and renders a verse', () => {
    renderWithProviders(<SurahView surahId="1" />);

    // Verse container rendered by VerseCard
    const verseEl = document.querySelector('#verse-1');
    expect(verseEl).toBeInTheDocument();
  });

  it('exposes touch-friendly actions on mobile (min-h-touch)', () => {
    renderWithProviders(<SurahView surahId="1" />);

    // Three-dot action menu button in MobileVerseActions
    const menuButton = screen.getByRole('button', { name: /open verse actions menu/i });
    expect(menuButton).toHaveClass('min-h-touch');

    // Open bottom sheet and assert an action is visible
    fireEvent.click(menuButton);
    expect(screen.getByText(/Add Bookmark|Remove Bookmark/)).toBeInTheDocument();
  });
});

