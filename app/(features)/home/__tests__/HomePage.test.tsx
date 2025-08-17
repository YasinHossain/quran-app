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
  document.documentElement.dataset.theme = '';
});

it('search filtering returns only matching Surahs', async () => {
  renderHome();
  const input = screen.getByPlaceholderText('What do you want to read?');
  await userEvent.type(input, 'Baqarah');
  expect(screen.getByText('Al-Baqarah')).toBeInTheDocument();
  expect(screen.queryByText('Al-Fatihah')).not.toBeInTheDocument();
});

it('theme toggle updates the data-theme attribute', async () => {
  renderHome();
  const nav = screen.getByRole('navigation');
  const themeButton = within(nav).getByRole('button');
  expect(document.documentElement.dataset.theme).toBe('light');
  await userEvent.click(themeButton);
  await waitFor(() => {
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});

it('tab switching between “Surah,” “Juz,” and “Page” changes rendered content and links', async () => {
  renderHome();
  // default tab shows Surahs
  const surahLink = screen.getByText('Al-Fatihah').closest('a');
  expect(surahLink).toHaveAttribute('href', '/surah/1');

  await userEvent.click(screen.getByRole('button', { name: 'Juz' }));
  const juzLink = screen.getByText('Juz 1').closest('a');
  expect(juzLink).toHaveAttribute('href', '/juz/1');

  await userEvent.click(screen.getByRole('button', { name: 'Page' }));
  const pageLink = screen.getByText('Page 1').closest('a');
  expect(pageLink).toHaveAttribute('href', '/page/1');

  await userEvent.click(screen.getByRole('button', { name: 'Surah' }));
  expect(screen.getByText('Al-Fatihah')).toBeInTheDocument();
});
