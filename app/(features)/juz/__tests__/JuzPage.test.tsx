import { JuzClient } from '@/app/(features)/juz/[juzId]/JuzClient';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import * as api from '@/lib/api';
import { Verse } from '@/types';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  const identity = <T,>(x: T): T => x;
  return { ...actual, use: identity };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockVerse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'verse text',
  words: [],
} as Verse;
jest.mock('@/lib/api');

beforeAll(() => {
  setMatchMedia(false);
});

beforeEach(() => {
  (api.getTranslations as jest.Mock).mockResolvedValue([]);
  (api.getVersesByJuz as jest.Mock).mockResolvedValue({ verses: [mockVerse], totalPages: 1 });
});

const renderPage = (): void => {
  renderWithProviders(<JuzClient juzId="1" />);
};

test('renders verses for selected juz', async () => {
  renderPage();
  expect(await screen.findByText('verse text')).toBeInTheDocument();
  expect(api.getVersesByJuz).toHaveBeenCalled();
});
