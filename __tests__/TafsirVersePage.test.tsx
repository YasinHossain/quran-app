import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TafsirVersePage from '@/app/features/tafsir/[surahId]/[ayahId]/page';
import { SettingsProvider } from '@/app/context/SettingsContext';
import { AudioProvider } from '@/app/features/player/context/AudioContext';
import { SidebarProvider } from '@/app/context/SidebarContext';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { Verse } from '@/types';
import useSWR from 'swr';
import { getTafsirCached } from '@/lib/tafsir/tafsirCache';

jest.mock('swr');
jest.mock('@/lib/tafsir/tafsirCache');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useParams: jest.fn(),
}));

const mockUseSWR = useSWR as jest.Mock;
const mockGetTafsirCached = getTafsirCached as jest.Mock;
const useParams = require('next/navigation').useParams as jest.Mock;

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

const verse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'verse text',
  words: [],
  translations: [{ resource_id: 20, text: 'translation' }],
};

const resources = [
  { id: 1, name: 'Tafsir One', language_name: 'english' },
  { id: 2, name: 'Tafsir Two', language_name: 'english' },
];

beforeEach(() => {
  localStorage.setItem(
    'quranAppSettings',
    JSON.stringify({ tafsirIds: [1, 2], translationId: 20 })
  );
  mockGetTafsirCached.mockImplementation((key: string, id: number) =>
    Promise.resolve(`Text ${id}`)
  );
  mockUseSWR.mockImplementation((key: any) => {
    if (key === 'tafsirs') return { data: resources };
    if (Array.isArray(key) && key[0] === 'verse') return { data: verse };
    return { data: undefined };
  });
});

const renderPage = () =>
  render(
    <AudioProvider>
      <SettingsProvider>
        <ThemeProvider>
          <SidebarProvider>
            <TafsirVersePage />
          </SidebarProvider>
        </ThemeProvider>
      </SettingsProvider>
    </AudioProvider>
  );

test('navigates to next verse', async () => {
  useParams.mockReturnValue({ surahId: '1', ayahId: '1' });
  renderPage();
  await userEvent.click(screen.getByLabelText('Next'));
  expect(push).toHaveBeenCalledWith('/features/tafsir/1/2');
});

test('navigates to previous surah when prev pressed', async () => {
  useParams.mockReturnValue({ surahId: '2', ayahId: '1' });
  renderPage();
  await userEvent.click(screen.getByLabelText('Previous'));
  expect(push).toHaveBeenCalledWith('/features/tafsir/1/7');
});

test('switches tafsir tabs', async () => {
  useParams.mockReturnValue({ surahId: '1', ayahId: '1' });
  renderPage();
  await screen.findByRole('button', { name: 'Tafsir Two' });
  await userEvent.click(screen.getByRole('button', { name: 'Tafsir Two' }));
  expect(await screen.findByText('Text 2')).toBeInTheDocument();
});
