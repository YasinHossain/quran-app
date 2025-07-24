import { render, screen } from '@testing-library/react';
import { SettingsProvider } from '@/app/context/SettingsContext';
import { AudioProvider } from '@/app/context/AudioContext';
import { SidebarProvider } from '@/app/context/SidebarContext';
import { ThemeProvider } from '@/app/context/ThemeContext';
import JuzPage from '@/app/features/juz/[juzId]/page';
import { Verse, Juz } from '@/types';
import * as api from '@/lib/api';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return { ...actual, use: (v: any) => v };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
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
  class IO {
    observe() {}
    disconnect() {}
  }
  // @ts-ignore
  global.IntersectionObserver = IO;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
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
        <ThemeProvider>
          <SidebarProvider>
            <JuzPage params={{ juzId: '1' }} />
          </SidebarProvider>
        </ThemeProvider>
      </SettingsProvider>
    </AudioProvider>
  );

test('renders juz info and verses', async () => {
  renderPage();
  expect(await screen.findByText('juz_number')).toBeInTheDocument();
  expect(await screen.findByText('verse text')).toBeInTheDocument();
});
