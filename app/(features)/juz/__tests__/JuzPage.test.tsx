import { JuzClient } from '@/app/(features)/juz/[juzId]/JuzClient';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import * as api from '@/lib/api';
import { identity } from '@/tests/mocks';
import { Verse, Juz } from '@/types';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  const identity = <T>(x: T): T => x;
  return { ...actual, use: identity };
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

const renderPage = (): void => {
  renderWithProviders(<JuzClient juzId="1" />);
};

test('renders juz info and verses', async () => {
  renderPage();
  expect(await screen.findByText('juz_number')).toBeInTheDocument();
  expect(await screen.findByText('verse text')).toBeInTheDocument();
});
