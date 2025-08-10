import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/app/components/shared/Header';
import { SettingsSidebar } from '@/app/features/surah/[surahId]/_components/SettingsSidebar';
import { WordLanguagePanel } from '@/app/features/surah/[surahId]/_components/WordLanguagePanel';
import { TranslationPanel } from '@/app/features/surah/[surahId]/_components/TranslationPanel';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { HeaderVisibilityProvider } from '@/app/features/layout/context/HeaderVisibilityContext';

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
  <ThemeProvider>
    <HeaderVisibilityProvider>
      <SettingsProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </SettingsProvider>
    </HeaderVisibilityProvider>
  </ThemeProvider>
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
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('opens via header icon, switches font tabs, and closes with back button', async () => {
    render(
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

    // Open settings sidebar
    await userEvent.click(screen.getByLabelText('Open Settings'));
    expect(screen.getByText('reading_setting')).toBeInTheDocument();

    // Switch font tab
    await userEvent.click(screen.getByRole('button', { name: 'KFGQPC Uthman Taha' }));
    expect(screen.getByText('select_font_face')).toBeInTheDocument();

    // Change font option
    await userEvent.click(screen.getByRole('button', { name: 'IndoPak' }));
    expect(screen.getByText('Noto Nastaliq Urdu')).toBeInTheDocument();

    // Close with back button
    const panel = screen.getByText('select_font_face').parentElement?.parentElement as HTMLElement;
    const backButtons = screen.getAllByRole('button', { name: 'Back' });
    await userEvent.click(backButtons[1]);
    expect(panel?.className).toContain('translate-x-full');
  });

  it("translation tab doesn't open translation panel", async () => {
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
          <TranslationPanel
            isOpen={open}
            onClose={() => setOpen(false)}
            groupedTranslations={{}}
            searchTerm=""
            onSearchTermChange={() => {}}
          />
        </Wrapper>
      );
    };

    render(<TestComponent />);

    await userEvent.click(screen.getByLabelText('Open Settings'));
    // Click translation tab while sidebar is open
    await userEvent.click(screen.getByRole('button', { name: 'Translation' }));
    // Translation panel should remain hidden
    const panel = screen.getByText('translations_panel_title').parentElement
      ?.parentElement as HTMLElement;
    expect(panel.className).toContain('translate-x-full');
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
          />
          <WordLanguagePanel
            isOpen={open}
            onClose={() => setOpen(false)}
            languages={[{ id: 1, name: 'Bangla' }]}
            searchTerm=""
            onSearchTermChange={() => {}}
            onReset={() => {}}
          />
        </Wrapper>
      );
    };

    render(<TestComponent />);

    await userEvent.click(screen.getByLabelText('Open Settings'));
    await userEvent.click(screen.getByRole('button', { name: 'Bangla' }));
    expect(screen.getAllByText('Bangla').length).toBeGreaterThan(1);
  });
});
