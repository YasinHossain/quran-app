import userEvent from '@testing-library/user-event';
import useSWR from 'swr';

import TafsirVersePage from '@/app/(features)/tafsir/[surahId]/[ayahId]/page';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { push } from '@/app/testUtils/mockRouter';
import { renderWithProviders, screen, waitFor } from '@/app/testUtils/renderWithProviders';
import { getTafsirCached } from '@/lib/tafsir/tafsirCache';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { Verse } from '@/types';

jest.mock('@/app/shared/hooks/useSingleVerse', () => ({
  useSingleVerse: jest.fn(),
}));
jest.mock('@/app/(features)/tafsir/hooks/useVerseNavigation', () => ({
  useVerseNavigation: () => ({
    prev: { surahId: '1', ayahId: 7 },
    next: { surahId: '1', ayahId: 2 },
    navigate: ({ surahId, ayahId }: { surahId: string; ayahId: number }) =>
      push(`/tafsir/${surahId}/${ayahId}`),
    currentSurah: { number: 1, verses: 7 },
  }),
}));
jest.mock('swr', () => {
  const actual = jest.requireActual('swr');
  return { __esModule: true, ...actual, default: jest.fn() };
});
jest.mock('@/lib/tafsir/tafsirCache');
jest.mock('react', () => {
  const actual = jest.requireActual('react');
  const identity = <T,>(x: T): T => x;
  return { ...actual, use: identity };
});
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUseSWR = useSWR as jest.Mock;
const mockGetTafsirCached = getTafsirCached as jest.Mock;
const mockUseSingleVerse = jest.requireMock('@/app/shared/hooks/useSingleVerse')
  .useSingleVerse as jest.Mock;

beforeAll(() => {
  setMatchMedia(false);
  jest.spyOn(logger, 'error').mockImplementation(() => {});
});

const verse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'verse text',
  words: [],
  translations: [{ resource_id: 20, text: 'translation' }],
};

const resources = [
  { id: 1, name: 'Tafsir One', lang: 'english' },
  { id: 2, name: 'Tafsir Two', lang: 'english' },
];

beforeEach(() => {
  localStorage.setItem(
    'quranAppSettings',
    JSON.stringify({ tafsirIds: [1, 2], translationId: 20 })
  );
  mockGetTafsirCached.mockImplementation((key: string, id: number) =>
    Promise.resolve(`Text ${id}`)
  );
  mockUseSWR.mockImplementation((key: string | readonly unknown[]) => {
    if (key === 'tafsirs') return { data: resources };
    if (Array.isArray(key) && key[0] === 'tafsir') return { data: `Rendered ${key[2]}` };
    return { data: undefined };
  });
  mockUseSingleVerse.mockReturnValue({ verse, isLoading: false, error: null, mutate: jest.fn() });
});

const renderPage = (surahId = '1', ayahId = '1'): void => {
  renderWithProviders(
    <TafsirVersePage
      params={{ surahId, ayahId } as unknown as Promise<{ surahId: string; ayahId: string }>}
    />
  );
};

test('navigates to next verse', async () => {
  renderPage('1', '1');
  await waitFor(() => expect(screen.getByLabelText('Next')).not.toBeDisabled());
  await userEvent.click(screen.getByLabelText('Next'));
  expect(push).toHaveBeenCalledWith('/tafsir/1/2');
});

test('navigates to previous surah when prev pressed', async () => {
  renderPage('2', '1');
  await waitFor(() => expect(screen.getByLabelText('Previous')).not.toBeDisabled());
  await userEvent.click(screen.getByLabelText('Previous'));
  expect(push).toHaveBeenCalledWith('/tafsir/1/7');
});
