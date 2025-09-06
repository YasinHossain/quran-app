import React from 'react';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { SurahView } from '../../SurahView.client';

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

export const defaultPanels = {
  isTranslationPanelOpen: false,
  openTranslationPanel: jest.fn(),
  closeTranslationPanel: jest.fn(),
  isWordLanguagePanelOpen: false,
  openWordLanguagePanel: jest.fn(),
  closeWordLanguagePanel: jest.fn(),
  selectedTranslationName: 'Sahih International',
  selectedWordLanguageName: 'English',
};

export const defaultVerseListing = {
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
};

export const mockUseSurahPanels = jest.fn().mockReturnValue(defaultPanels);
export const mockUseVerseListing = jest.fn().mockReturnValue(defaultVerseListing);

jest.mock('../../hooks', () => {
  const actual = jest.requireActual('../../hooks');
  return {
    ...actual,
    useSurahPanels: (...args: unknown[]) => mockUseSurahPanels(...args),
    useVerseListing: (...args: unknown[]) => mockUseVerseListing(...args),
  };
});

export const renderSurahView = (surahId = '1') => {
  return renderWithProviders(<SurahView surahId={surahId} />);
};
