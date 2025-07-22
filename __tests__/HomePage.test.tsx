import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/components/HomePage';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { SettingsProvider } from '@/app/context/SettingsContext';

// Mock next/link to simply render an anchor tag
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Avoid network requests from VerseOfDay during tests
jest.mock('@/app/components/VerseOfDay', () => () => <div />);

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
    <ThemeProvider>
      <SettingsProvider>
        <HomePage />
      </SettingsProvider>
    </ThemeProvider>
  );

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
