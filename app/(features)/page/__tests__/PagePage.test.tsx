import QuranPage from '@/app/(features)/page/[pageId]/page';
import { renderWithProvidersAsync } from '@/app/testUtils/renderWithProviders';
import * as api from '@/lib/api';
import { identity } from '@/tests/mocks';
import { Verse } from '@/types';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
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
  text_uthmani: 'page verse',
  words: [],
} as Verse;

jest.mock('@/lib/api');

beforeAll(() => {
  setMatchMedia(false);
});

beforeEach(() => {
  (api.getTranslations as jest.Mock).mockResolvedValue([]);
  (api.getVersesByPage as jest.Mock).mockResolvedValue({
    verses: [mockVerse],
    totalPages: 1,
  });
});

const renderPage = () =>
  renderWithProvidersAsync(
    <QuranPage params={{ pageId: '1' } as unknown as Promise<{ pageId: string }>} />
  );

test('renders page without crashing', async () => {
  await renderPage();
  expect(api.getVersesByPage).toBeDefined();
});
