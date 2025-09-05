import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';

import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { SettingsSidebar, TranslationPanel } from '@/app/(features)/surah/components';
import { Header } from '@/app/shared/Header';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { logger } from '@/src/infrastructure/monitoring/Logger';

// mock translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// mock next/navigation for Header
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <HeaderVisibilityProvider>{children}</HeaderVisibilityProvider>
);

describe('SettingsSidebar interactions', () => {
  let errorSpy: jest.SpyInstance;
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
    errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('opens via header icon, switches font tabs, and closes with back button', async () => {
    renderWithProviders(
      <Wrapper>
        <Header />
        <SettingsSidebar
          onTranslationPanelOpen={() => {}}
          onWordLanguagePanelOpen={() => {}}
          selectedTranslationName="English"
          selectedWordLanguageName="English"
        />
      </Wrapper>
    );

    const aside = document.querySelector('aside');
    expect(aside?.className).toContain('translate-x-full');

    await userEvent.click(screen.getByLabelText('Open Settings'));
    expect(await screen.findByText('reading_setting')).toBeInTheDocument();

    // Switch font tab
    const [fontButton] = screen.getAllByRole('button', { name: 'KFGQPC Uthman Taha' });
    await userEvent.click(fontButton);

    await userEvent.click(screen.getByRole('button', { name: 'IndoPak' }));
    expect(screen.getByText('Noto Nastaliq Urdu')).toBeInTheDocument();

    // Close sidebar
    const backButtons = screen.getAllByRole('button', { name: 'Back' });
    await userEvent.click(backButtons[1]);
  });

  it('clicking translation tab does not open translation panel', async () => {
    const TestComponent = () => {
      const [open, setOpen] = useState(false);
      return (
        <Wrapper>
          <Header />
          <SettingsSidebar
            onTranslationPanelOpen={() => setOpen(true)}
            onWordLanguagePanelOpen={() => {}}
            selectedTranslationName="English"
            selectedWordLanguageName="English"
          />
          <TranslationPanel isOpen={open} onClose={() => setOpen(false)} />
        </Wrapper>
      );
    };

    renderWithProviders(<TestComponent />);

    await userEvent.click(screen.getByLabelText('Open Settings'));
    await userEvent.click(screen.getAllByRole('button', { name: 'Translation' })[0]);
    const panel = screen.getByTestId('translation-panel');
    expect(panel).toHaveClass('translate-x-full');
  });

  it('opens the word translation panel and shows languages', async () => {
    const TestComponent = () => {
      const [open, setOpen] = useState(false);
      return (
        <Wrapper>
          <Header />
          <SettingsSidebar
            onTranslationPanelOpen={() => {}}
            onWordLanguagePanelOpen={() => setOpen(true)}
            selectedTranslationName="English"
            selectedWordLanguageName="Bangla"
            isWordLanguagePanelOpen={open}
            onWordLanguagePanelClose={() => setOpen(false)}
          />
        </Wrapper>
      );
    };

    renderWithProviders(<TestComponent />);

    await userEvent.click(screen.getByLabelText('Open Settings'));
    const [banglaButton] = await screen.findAllByRole('button', { name: 'Bangla' });
    await userEvent.click(banglaButton);
    expect(screen.getAllByText('Bangla').length).toBeGreaterThan(1);
  });
});
