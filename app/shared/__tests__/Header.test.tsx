import React from 'react';

import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { UIStateProvider } from '@/app/providers/UIStateContext';
import { Header } from '@/app/shared/Header';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Returns the key itself for testing purposes
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}));

jest.mock('@/app/providers/UIStateContext', () => ({
  UIStateProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useUIState: () => ({
    openPanels: new Set(),
    openPanel: jest.fn(),
    closePanel: jest.fn(),
    togglePanel: jest.fn(),
    isPanelOpen: jest.fn(),
    closeAllPanels: jest.fn(),
    isSurahListOpen: false,
    setSurahListOpen: jest.fn(),
    isSettingsOpen: false,
    setSettingsOpen: jest.fn(),
    scrollPositions: {},
    setScrollPosition: jest.fn(),
    getScrollPosition: jest.fn(),
  }),
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
  Object.defineProperty(window, 'sessionStorage', {
    writable: true,
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
    },
  });
});

describe('Header', () => {
  it('renders the brand text', () => {
    renderWithProviders(
      <UIStateProvider>
        <HeaderVisibilityProvider>
          <Header />
        </HeaderVisibilityProvider>
      </UIStateProvider>
    );
    expect(screen.getByText('Quran Mazid')).toBeInTheDocument();
  });

  it('renders the search placeholder', () => {
    renderWithProviders(
      <UIStateProvider>
        <HeaderVisibilityProvider>
          <Header />
        </HeaderVisibilityProvider>
      </UIStateProvider>
    );
    expect(screen.getByPlaceholderText('Search verses, surahs...')).toBeInTheDocument();
  });

  it('aligns content vertically centered', () => {
    const { container } = renderWithProviders(
      <UIStateProvider>
        <HeaderVisibilityProvider>
          <Header />
        </HeaderVisibilityProvider>
      </UIStateProvider>
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('items-center');
  });
});
