import useSWRInfinite from 'swr/infinite';

import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import * as api from '@/lib/api';
import { Verse } from '@/types';

import { SurahView } from '@/app/(features)/surah/components';
import { UIStateProvider } from '@/app/providers/UIStateContext';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  const identity = <T>(value: T): T => value;
  return { ...actual, use: identity };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/lib/api', () => ({
  getTranslations: jest.fn(),
  getWordTranslations: jest.fn(),
  getSurahCoverUrl: jest.fn(),
  getVersesByChapter: jest.fn(),
}));
jest.mock('swr/infinite', () => ({ __esModule: true, default: jest.fn() }));

const mockVerse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'surah verse',
  words: [],
} as Verse;

beforeAll(() => {
  setMatchMedia(false);
});

beforeEach(() => {
  jest.clearAllMocks();
  (api.getTranslations as jest.Mock).mockResolvedValue([]);
  (api.getWordTranslations as jest.Mock).mockResolvedValue([]);
  (api.getSurahCoverUrl as jest.Mock).mockResolvedValue('');
  (useSWRInfinite as jest.Mock).mockImplementation(jest.requireActual('swr/infinite').default);
});

const renderPage = (): void => {
  renderWithProviders(
    <UIStateProvider>
      <SurahView surahId="1" />
    </UIStateProvider>
  );
};

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
