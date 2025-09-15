import React from 'react';

import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';

// Mock i18n to return keys directly
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Stable matchMedia for responsive utilities in JSDOM
beforeAll(() => {
  setMatchMedia(false);
});

// Ensure defaults are restored between tests even with resetMocks enabled
beforeEach(() => {
  mockUseSurahPanels.mockReturnValue(defaultPanels);
  mockUseVerseListing.mockReturnValue(defaultVerseListing);
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

jest.mock('@/app/(features)/surah/hooks', () => {
  const actual = jest.requireActual('@/app/(features)/surah/hooks');
  return {
    ...actual,
    useSurahPanels: (...args: unknown[]) => mockUseSurahPanels(...args),
    useVerseListing: (...args: unknown[]) => mockUseVerseListing(...args),
  };
});

export const renderSurahView = (surahId = '1'): ReturnType<typeof renderWithProviders> => {
  // Import after mocks are applied to ensure mocks take effect
  const module = require('../../SurahView.client.tsx');
  const SurahView = module.SurahView ?? module.default ?? module;
  return renderWithProviders(<SurahView surahId={surahId} />);
};
