import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/app/components/common/Header';
import { SettingsSidebar } from '@/app/features/surah/[surahId]/_components/SettingsSidebar';
import { SettingsProvider } from '@/app/context/SettingsContext';
import { SidebarProvider } from '@/app/context/SidebarContext';
import { ThemeProvider } from '@/app/context/ThemeContext';

// mock translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// mock next/navigation for Header
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <SettingsProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </SettingsProvider>
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
          onWordTranslationPanelOpen={() => {}}
          selectedTranslationName="English"
          selectedWordTranslationName="Bengali"
        />
      </Wrapper>
    );

    const aside = document.querySelector('aside');
    expect(aside?.className).toContain('translate-x-full');

    await userEvent.click(screen.getByLabelText('Open Settings'));
    expect(screen.getByText('reading_setting')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'KFGQPC Uthman Taha' }));
    expect(screen.getByText('select_font_face')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'IndoPak' }));
    expect(screen.getByText('Noto Nastaliq Urdu')).toBeInTheDocument();

    const panel = screen.getByText('select_font_face').parentElement?.parentElement as HTMLElement;
    await userEvent.click(screen.getAllByRole('button', { name: 'Back' })[1]);
    expect(panel?.className).toContain('translate-x-full');
  });
});
