import { screen, within, waitFor, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProvidersAsync } from '@/app/testUtils/renderWithProviders';
import { Verse } from '@/types';

import type { MockProps } from '@/tests/mocks';
import type { Chapter } from '@/types';
import type { JSX } from 'react';

jest.mock('@/lib/api', () => ({
  __esModule: true,
  getRandomVerse: () =>
    Promise.resolve({
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'بِسْمِ اللّهِ',
      translations: [
        {
          resource_id: 1,
          text: 'In the name of Allah',
        },
      ],
    } as Verse),
  getSurahList: () =>
    Promise.resolve([
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

jest.mock('@/app/shared/navigation/hooks/useNavigationDatasets', () => ({
  __esModule: true,
  useNavigationDatasets: () => ({
    juzs: [
      { number: 1, name: 'Juz 1', surahRange: 'Al-Fatihah - Al-Baqarah' },
      { number: 2, name: 'Juz 2', surahRange: 'Al-Baqarah - Ali Imran' },
    ],
    pages: [1, 2, 3],
  }),
}));

jest.mock('@/app/shared/navigation/hooks/useSurahNavigationData', () => ({
  __esModule: true,
  useSurahNavigationData: () => ({
    chapters: [
      {
        id: 1,
        name_simple: 'Al-Fatihah',
        name_arabic: 'الفاتحة',
        revelation_place: 'makkah',
        verses_count: 7,
      },
      {
        id: 2,
        name_simple: 'Al-Baqarah',
        name_arabic: 'البقرة',
        revelation_place: 'madinah',
        verses_count: 286,
      },
    ],
    surahs: [
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
    ],
    isLoading: false,
    error: undefined,
  }),
}));

// Mock next/link to simply render an anchor tag
jest.mock(
  'next/link',
  () =>
    ({ children, href }: MockProps<{ href: string }>): JSX.Element => <a href={href}>{children}</a>
);

// Mock VerseOfDay to avoid fetch during tests
jest.mock('@/app/(features)/home/components/VerseOfDay', () => ({
  __esModule: true,
  VerseOfDay: () => <div>VerseOfDay</div>,
}));

beforeAll(() => {
  setMatchMedia(false);
});

const { HomePageClient } = require('@/app/(features)/home/components/HomePageClient');
const { SurahGridServer } = require('@/app/(features)/home/components/SurahGridServer');

const initialChapters: Chapter[] = [
  {
    id: 1,
    name_simple: 'Al-Fatihah',
    name_arabic: 'الفاتحة',
    revelation_place: 'makkah',
    verses_count: 7,
  },
  {
    id: 2,
    name_simple: 'Al-Baqarah',
    name_arabic: 'البقرة',
    revelation_place: 'madinah',
    verses_count: 286,
  },
];

const initialVerses: Verse[] = [
  {
    id: 1,
    verse_key: '1:1',
    text_uthmani: 'بِسْمِ اللّهِ',
    words: [],
    translations: [{ resource_id: 20, text: 'In the name of Allah' }],
  },
];

const renderHome = (): Promise<RenderResult> =>
  renderWithProvidersAsync(
    <HomePageClient initialChapters={initialChapters} initialVerses={initialVerses}>
      <SurahGridServer chapters={initialChapters} />
    </HomePageClient>
  );

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

it('renders without runtime warnings', async () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  await renderHome();

  expect(errorSpy).not.toHaveBeenCalled();
  expect(warnSpy).not.toHaveBeenCalled();

  errorSpy.mockRestore();
  warnSpy.mockRestore();
});

it('search filtering returns only matching Surahs', async () => {
  await renderHome();
  await screen.findByText('Al-Fatihah');
  const input = screen.getByPlaceholderText('search_placeholder');
  await userEvent.type(input, 'Baqarah');
  expect(input).toHaveValue('Baqarah');
  expect(await screen.findByText('Al-Baqarah')).toBeInTheDocument();
});

it('theme toggle updates the dark class', async () => {
  await renderHome();
  const nav = screen.getByRole('navigation');
  const themeButton = within(nav).getByRole('button', { name: 'switch_to_dark' });
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  await userEvent.click(themeButton);
  await waitFor(() => {
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});

it('tab switching between “Surah” and “Juz” changes rendered content and links', async () => {
  await renderHome();
  const surahLink = (await screen.findByText('Al-Fatihah')).closest('a');
  expect(surahLink).toHaveAttribute('href', '/surah/1');

  await userEvent.click(screen.getByRole('button', { name: 'juz_tab' }));
  const juzLink = (await screen.findByText('Juz 1')).closest('a');
  expect(juzLink).toHaveAttribute('href', '/juz/1');

  await userEvent.click(screen.getByRole('button', { name: 'surah_tab' }));
  expect(await screen.findByText('Al-Fatihah')).toBeInTheDocument();
});
