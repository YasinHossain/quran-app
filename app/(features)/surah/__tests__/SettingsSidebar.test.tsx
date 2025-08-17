import React, { useState } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/app/shared/Header';
import { SettingsSidebar } from '@/app/(features)/surah/[surahId]/components/SettingsSidebar';
import { TranslationPanel } from '@/app/(features)/surah/[surahId]/components/translation-panel';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';

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
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
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

    await userEvent.click(screen.getAllByRole('button', { name: 'KFGQPC Uthman Taha' })[1]);
    await userEvent.click(screen.getAllByRole('button', { name: 'IndoPak' })[0]);

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
    await userEvent.click(screen.getAllByRole('button', { name: 'Bangla' })[0]);
    expect(screen.getAllByText('Bangla').length).toBeGreaterThan(1);
  });
});
