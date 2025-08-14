import { render, screen } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import SurahPage from '@/app/(features)/surah/[surahId]/page';
import { Verse } from '@/types';
import * as api from '@/lib/api';
import useSWRInfinite from 'swr/infinite';
import { SWRConfig } from 'swr';

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

jest.mock('@/lib/api');
jest.mock('swr/infinite', () => ({ __esModule: true, default: jest.fn() }));

const mockVerse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'surah verse',
  words: [],
} as Verse;

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
  jest.clearAllMocks();
  (api.getTranslations as jest.Mock).mockResolvedValue([]);
  (api.getWordTranslations as jest.Mock).mockResolvedValue([]);
  (useSWRInfinite as jest.Mock).mockImplementation(jest.requireActual('swr/infinite').default);
});

const renderPage = () =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <AudioProvider>
        <SettingsProvider>
          <BookmarkProvider>
            <ThemeProvider>
              <SidebarProvider>
                <SurahPage params={{ surahId: '1' } as unknown as Promise<{ surahId: string }>} />
              </SidebarProvider>
            </ThemeProvider>
          </BookmarkProvider>
        </SettingsProvider>
      </AudioProvider>
    </SWRConfig>
  );

test('renders verses on successful fetch', async () => {
  (api.getVersesByChapter as jest.Mock).mockResolvedValue({
    verses: [mockVerse],
    totalPages: 1,
  });

  renderPage();

  expect(await screen.findByText('surah verse')).toBeInTheDocument();
});

test('shows error message when fetch rejects', async () => {
  (api.getVersesByChapter as jest.Mock).mockRejectedValue(new Error('boom'));

  renderPage();

  expect(await screen.findByText('Failed to load content. boom')).toBeInTheDocument();
});
