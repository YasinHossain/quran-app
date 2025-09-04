import { screen, act, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import VerseOfDay from '@/app/(features)/home/components/VerseOfDay';
import { Verse } from '@/types';
import { getRandomVerse } from '@/lib/api';
import { getVerseByKey } from '@/lib/api/verses';

jest.mock('@/lib/api', () => ({
  getRandomVerse: jest.fn(),
  getSurahList: jest.fn().mockResolvedValue([
    {
      number: 1,
      name: 'Al-Fatihah',
      arabicName: 'الفاتحة',
      verses: 7,
      meaning: 'The Opening',
    },
  ]),
}));

jest.mock('@/lib/api/verses', () => ({
  getVerseByKey: jest.fn(),
}));

const mockedGetRandomVerse = getRandomVerse as jest.MockedFunction<typeof getRandomVerse>;
const mockedGetVerseByKey = getVerseByKey as jest.MockedFunction<typeof getVerseByKey>;

const renderVerseOfDay = (props?: Partial<React.ComponentProps<typeof VerseOfDay>>) =>
  renderWithProviders(<VerseOfDay {...props} />);

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
  document.documentElement.classList.remove('dark');
  mockedGetRandomVerse.mockReset();
  mockedGetVerseByKey.mockReset();
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

  mockedGetVerseByKey.mockResolvedValue({
    id: 99,
    verse_key: '2:255',
    text_uthmani: 'F',
    translations: [],
  } as Verse);

  renderVerseOfDay({ randomVerseInterval: 1 });

  expect(await screen.findByText('A')).toBeInTheDocument();

  await act(async () => {
    jest.advanceTimersByTime(10000);
  });

  await waitFor(() => expect(screen.getByText('B')).toBeInTheDocument());
});

it('fetches random verse after specified rotations', async () => {
  const randomVerses: Verse[] = [
    { id: 1, verse_key: '1:1', text_uthmani: 'A', translations: [] },
    { id: 2, verse_key: '1:2', text_uthmani: 'B', translations: [] },
  ];

  mockedGetRandomVerse
    .mockResolvedValueOnce(randomVerses[0])
    .mockResolvedValueOnce(randomVerses[1]);

  mockedGetVerseByKey.mockResolvedValue({
    id: 100,
    verse_key: '2:255',
    text_uthmani: 'F',
    translations: [],
  } as Verse);

  renderVerseOfDay({ randomVerseInterval: 2 });

  expect(await screen.findByText('A')).toBeInTheDocument();

  await act(async () => {
    jest.advanceTimersByTime(10000);
  });

  await waitFor(() => expect(screen.getByText('F')).toBeInTheDocument());

  await act(async () => {
    jest.advanceTimersByTime(10000);
  });

  await waitFor(() => expect(screen.getByText('B')).toBeInTheDocument());

  expect(mockedGetRandomVerse).toHaveBeenCalledTimes(2);
});

it('shows error message when fetching verse fails', async () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  // Mock the retry mechanism to fail fast in tests by making the delay 0
  const originalSetTimeout = global.setTimeout;
  global.setTimeout = ((callback: () => void) => {
    callback();
    return 0 as unknown as NodeJS.Timeout;
  }) as typeof setTimeout;

  mockedGetRandomVerse.mockRejectedValue(new Error('fail'));
  mockedGetVerseByKey.mockResolvedValue({
    id: 100,
    verse_key: '2:255',
    text_uthmani: 'F',
    translations: [],
  } as Verse);

  renderVerseOfDay();

  await waitFor(
    () => expect(screen.getByText(/Unable to connect to Quran service/)).toBeInTheDocument(),
    { timeout: 5000 }
  );

  global.setTimeout = originalSetTimeout;
  consoleSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});
