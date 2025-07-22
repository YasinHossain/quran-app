import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/components/HomePage';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { SettingsProvider } from '@/app/context/SettingsContext';
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
jest.mock('@/app/components/VerseOfDay', () => () => <div>VerseOfDay</div>);

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

const renderHome = () =>
  render(
    <ThemeProvider initialTheme="light">
      <SettingsProvider>
        <HomePage />
      </SettingsProvider>
    </ThemeProvider>
  );

beforeEach(() => {
  localStorage.clear();
  // This ensures each test starts in a clean state (light mode).
  document.documentElement.classList.remove('dark');
});

it('search filtering returns only matching Surahs', async () => {
  renderHome();
  const input = screen.getByPlaceholderText('What do you want to read?');
  await userEvent.type(input, 'Baqarah');
  expect(screen.getByText('Al-Baqarah')).toBeInTheDocument();
  expect(screen.queryByText('Al-Fatihah')).not.toBeInTheDocument();
});

it('theme toggle updates the dark class', async () => {
  renderHome();
  const nav = screen.getByRole('navigation');
  const themeButton = within(nav).getByRole('button');
  
  // Starts in light mode
  expect(document.documentElement.classList.contains('dark')).toBe(false);

  // Click to switch to dark mode
  await userEvent.click(themeButton);
  await waitFor(() => {
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  // Click again to switch back to light mode
  await userEvent.click(themeButton);
    await waitFor(() => {
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

it('tab switching between “Surah,” “Juz,” and “Page” changes rendered content', async () => {
  renderHome();
  // default tab shows Surahs
  expect(screen.getByText('Al-Fatihah')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Juz' }));
  expect(screen.getByText('Juz 1')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Page' }));
  expect(screen.getByText('Page 1')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Surah' }));
  expect(screen.getByText('Al-Fatihah')).toBeInTheDocument();
});
