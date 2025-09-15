import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { HomePage } from '@/app/(features)/home/components/HomePage';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProvidersAsync } from '@/app/testUtils/renderWithProviders';
import { Verse } from '@/types';

import type { MockProps } from '@/tests/mocks';

jest.mock('@/lib/api', () => ({
  __esModule: true,
  getRandomVerse: jest.fn().mockResolvedValue({
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

// Mock next/link to simply render an anchor tag
jest.mock(
  'next/link',
  () =>
    ({ children, href }: MockProps<{ href: string }>): JSX.Element => <a href={href}>{children}</a>
);

// Mock VerseOfDay to avoid fetch during tests
jest.mock(
  '@/app/(features)/home/components/VerseOfDay',
  () => (): JSX.Element => <div>VerseOfDay</div>
);

beforeAll(() => {
  setMatchMedia(false);
});

const renderHome = () => renderWithProvidersAsync(<HomePage />);

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

it('search filtering returns only matching Surahs', async () => {
  await renderHome();
  await screen.findByText('Al-Fatihah');
  const input = screen.getByPlaceholderText('What do you want to read?');
  await userEvent.type(input, 'Baqarah');
  expect(await screen.findByText('Al-Baqarah')).toBeInTheDocument();
  expect(screen.queryByText('Al-Fatihah')).not.toBeInTheDocument();
});

it('theme toggle updates the dark class', async () => {
  await renderHome();
  const nav = screen.getByRole('navigation');
  const themeButton = within(nav).getByRole('button');
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  await userEvent.click(themeButton);
  await waitFor(() => {
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});

it('tab switching between “Surah,” “Juz,” and “Page” changes rendered content and links', async () => {
  await renderHome();
  const surahLink = (await screen.findByText('Al-Fatihah')).closest('a');
  expect(surahLink).toHaveAttribute('href', '/surah/1');

  await userEvent.click(screen.getByRole('button', { name: 'Juz' }));
  const juzLink = (await screen.findByText('Juz 1')).closest('a');
  expect(juzLink).toHaveAttribute('href', '/juz/1');

  await userEvent.click(screen.getByRole('button', { name: 'Page' }));
  const pageLink = (await screen.findByText('Page 1')).closest('a');
  expect(pageLink).toHaveAttribute('href', '/page/1');

  await userEvent.click(screen.getByRole('button', { name: 'Surah' }));
  expect(await screen.findByText('Al-Fatihah')).toBeInTheDocument();
});
