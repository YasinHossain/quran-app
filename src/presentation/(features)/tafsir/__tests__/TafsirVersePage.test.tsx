import { renderWithProviders, screen } from '@/presentation/testUtils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import TafsirVersePage from '@/presentation/(features)/tafsir/[surahId]/[ayahId]/page';
import { Verse } from '@/types';
import useSWR from 'swr';
import { getTafsirCached } from '@/lib/tafsir/tafsirCache';

jest.mock('@/lib/api', () => ({
  getSurahList: jest.fn().mockResolvedValue([
    {
      number: 1,
      name: 'Al-Fatihah',
      arabicName: 'الفاتحة',
      verses: 7,
      meaning: 'The Opening',
    },
    {
      number: 2,
      name: 'Al-Baqarah',
      arabicName: 'البقرة',
      verses: 286,
      meaning: 'The Cow',
    },
  ]),
}));

jest.mock('swr', () => {
  const actual = jest.requireActual('swr');
  return { __esModule: true, ...actual, default: jest.fn() };
});
jest.mock('@/lib/tafsir/tafsirCache');

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return { ...actual, use: (v: any) => v };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const mockUseSWR = useSWR as jest.Mock;
const mockGetTafsirCached = getTafsirCached as jest.Mock;

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
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
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
  mockUseSWR.mockImplementation((key: any) => {
    if (key === 'tafsirs') return { data: resources };
    if (Array.isArray(key) && key[0] === 'verse') return { data: verse };
    return { data: undefined };
  });
});

const renderPage = (surahId = '1', ayahId = '1') =>
  renderWithProviders(
    <TafsirVersePage
      params={{ surahId, ayahId } as unknown as Promise<{ surahId: string; ayahId: string }>}
    />
  );

test('navigates to next verse', async () => {
  renderPage('1', '1');
  await userEvent.click(await screen.findByLabelText('Next'));
  expect(push).toHaveBeenCalledWith('/tafsir/1/2');
});

test('navigates to previous surah when prev pressed', async () => {
  renderPage('2', '1');
  await userEvent.click(await screen.findByLabelText('Previous'));
  expect(push).toHaveBeenCalledWith('/tafsir/1/7');
});

test('switches tafsir tabs', async () => {
  renderPage('1', '1');
  await screen.findByRole('button', { name: 'Tafsir Two' });
  await userEvent.click(screen.getByRole('button', { name: 'Tafsir Two' }));
  expect(await screen.findByText('Text 2')).toBeInTheDocument();
});
