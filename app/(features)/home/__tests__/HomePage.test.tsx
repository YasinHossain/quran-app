import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/(features)/home/components/HomePage';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { Verse } from '@/types';

jest.mock('@/lib/api', () => ({
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
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock VerseOfDay to avoid fetch during tests
jest.mock('@/app/(features)/home/components/VerseOfDay', () => () => <div>VerseOfDay</div>);

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

const renderHome = () => renderWithProviders(<HomePage />);

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

it('search filtering returns only matching Surahs', async () => {
  renderHome();
  await screen.findByText('Al-Fatihah');
  const input = screen.getByPlaceholderText('What do you want to read?');
  await userEvent.type(input, 'Baqarah');
  expect(await screen.findByText('Al-Baqarah')).toBeInTheDocument();
  expect(screen.queryByText('Al-Fatihah')).not.toBeInTheDocument();
});

it('theme toggle updates the root class', async () => {
  renderHome();
  const nav = screen.getByRole('navigation');
  const themeButton = within(nav).getByRole('button');
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  await userEvent.click(themeButton);
  await waitFor(() => {
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});

it('tab switching between “Surah,” “Juz,” and “Page” changes rendered content and links', async () => {
  renderHome();
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
