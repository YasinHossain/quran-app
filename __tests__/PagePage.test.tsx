import { render, screen } from '@testing-library/react';
import { SettingsProvider } from '@/app/context/SettingsContext';
import { AudioProvider } from '@/app/context/AudioContext';
import { SidebarProvider } from '@/app/context/SidebarContext';
import { ThemeProvider } from '@/app/context/ThemeContext';
import QuranPage from '@/app/features/page/[pageId]/page';
import { Verse } from '@/types';
import * as api from '@/lib/api';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return { ...actual, use: (v: any) => v };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockVerse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'page verse',
  words: [],
} as Verse;

jest.mock('@/lib/api');

beforeAll(() => {
  class IO {
    observe() {}
    disconnect() {}
  }
  (
    global as unknown as { IntersectionObserver: typeof IntersectionObserver }
  ).IntersectionObserver = IO as unknown as typeof IntersectionObserver;

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
  (api.getTranslations as jest.Mock).mockResolvedValue([]);
  (api.getVersesByPage as jest.Mock).mockResolvedValue({ verses: [mockVerse], totalPages: 1 });
});

const renderPage = () =>
  render(
    <AudioProvider>
      <SettingsProvider>
        <ThemeProvider>
          <SidebarProvider>
            <QuranPage params={{ pageId: '1' }} />
          </SidebarProvider>
        </ThemeProvider>
      </SettingsProvider>
    </AudioProvider>
  );

test('renders verses for page', async () => {
  renderPage();
  expect(await screen.findByText('page verse')).toBeInTheDocument();
});
