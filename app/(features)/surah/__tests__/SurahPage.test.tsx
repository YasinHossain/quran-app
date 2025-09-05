import useSWRInfinite from 'swr/infinite';

import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import * as api from '@/lib/api';
import { identity } from '@/tests/mocks';
import { Verse } from '@/types';

import SurahClient from '@/app/(features)/surah/[surahId]/SurahClient';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return { ...actual, use: identity };
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
  (api.getSurahCoverUrl as jest.Mock).mockResolvedValue('');
  (useSWRInfinite as jest.Mock).mockImplementation(jest.requireActual('swr/infinite').default);
});

const renderPage = () => renderWithProviders(<SurahClient surahId="1" />);

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
