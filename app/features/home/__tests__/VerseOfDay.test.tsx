import { render, screen, act, waitFor } from '@testing-library/react';
import VerseOfDay from '@/app/features/home/VerseOfDay';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { Verse } from '@/types';
import { getRandomVerse } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  getRandomVerse: jest.fn(),
}));

const mockedGetRandomVerse = getRandomVerse as jest.MockedFunction<typeof getRandomVerse>;

const renderVerseOfDay = () =>
  render(
    <ThemeProvider>
      <SettingsProvider>
        <VerseOfDay />
      </SettingsProvider>
    </ThemeProvider>
  );

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

beforeEach(() => {
  jest.useFakeTimers();
  localStorage.clear();
  document.documentElement.dataset.theme = '';
  mockedGetRandomVerse.mockReset();
});

afterEach(() => {
  jest.useRealTimers();
});

it('rotates through verses in queue', async () => {
  const verses: Verse[] = [
    { id: 1, verse_key: '1:1', text_uthmani: 'A', translations: [] },
    { id: 2, verse_key: '1:2', text_uthmani: 'B', translations: [] },
    { id: 3, verse_key: '1:3', text_uthmani: 'C', translations: [] },
    { id: 4, verse_key: '1:4', text_uthmani: 'D', translations: [] },
  ];

  mockedGetRandomVerse
    .mockResolvedValueOnce(verses[0])
    .mockResolvedValueOnce(verses[1])
    .mockResolvedValueOnce(verses[2])
    .mockResolvedValueOnce(verses[3]);

  renderVerseOfDay();

  expect(await screen.findByText('A')).toBeInTheDocument();

  await act(async () => {
    jest.advanceTimersByTime(10000);
  });

  await waitFor(() => expect(screen.getByText('B')).toBeInTheDocument());
});

it('shows error message when fetching verse fails', async () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  mockedGetRandomVerse.mockRejectedValue(new Error('fail'));

  renderVerseOfDay();

  await waitFor(() => expect(screen.getByText('Failed to load verse.')).toBeInTheDocument());

  consoleSpy.mockRestore();
});
