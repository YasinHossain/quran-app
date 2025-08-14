import { render, screen } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import JuzPage from '@/app/(features)/juz/[juzId]/page';
import { Verse, Juz } from '@/types';
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
  text_uthmani: 'verse text',
  words: [],
} as Verse;
const mockJuz: Juz = {
  id: 1,
  juz_number: 1,
  verse_mapping: {},
  first_verse_id: 1,
  last_verse_id: 1,
  verses_count: 1,
};

jest.mock('@/lib/api');

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
  (api.getTranslations as jest.Mock).mockResolvedValue([]);
  (api.getVersesByJuz as jest.Mock).mockResolvedValue({ verses: [mockVerse], totalPages: 1 });
  (api.getJuz as jest.Mock).mockResolvedValue(mockJuz);
});

const renderPage = () =>
  render(
    <AudioProvider>
      <SettingsProvider>
        <BookmarkProvider>
          <ThemeProvider>
            <SidebarProvider>
              <JuzPage
                params={{ juzId: '1' } as unknown as Promise<{ juzId: string }>}
                searchParams={{}}
              />
            </SidebarProvider>
          </ThemeProvider>
        </BookmarkProvider>
      </SettingsProvider>
    </AudioProvider>
  );

test('renders juz info and verses', async () => {
  renderPage();
  expect(await screen.findByText('juz_number')).toBeInTheDocument();
  expect(await screen.findByText('verse text')).toBeInTheDocument();
});
