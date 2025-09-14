import { screen, act, waitFor } from '@testing-library/react';

import {
  mockedGetRandomVerse,
  mockedGetVerseByKey,
  renderVerseOfDay,
  setupMatchMedia,
  resetTestMocks,
  restoreTimers,
  Verse,
} from './VerseOfDay.fixtures';

beforeAll(setupMatchMedia);
beforeEach(resetTestMocks);
afterEach(restoreTimers);

it('rotates through verses in queue', async () => {
  const verses: Verse[] = [
    {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'A',
      translations: [{ resource_id: 20, text: 'Translation A' }],
    },
    {
      id: 2,
      verse_key: '1:2',
      text_uthmani: 'B',
      translations: [{ resource_id: 20, text: 'Translation B' }],
    },
    {
      id: 3,
      verse_key: '1:3',
      text_uthmani: 'C',
      translations: [{ resource_id: 20, text: 'Translation C' }],
    },
    {
      id: 4,
      verse_key: '1:4',
      text_uthmani: 'D',
      translations: [{ resource_id: 20, text: 'Translation D' }],
    },
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
    translations: [{ resource_id: 20, text: 'Translation F' }],
  } as Verse);

  await renderVerseOfDay({ randomVerseInterval: 1 });

  expect(await screen.findByText('A')).toBeInTheDocument();

  await act(async () => {
    jest.advanceTimersByTime(10000);
  });

  await waitFor(() => expect(screen.getByText('B')).toBeInTheDocument());
});

it('fetches random verse after specified rotations', async () => {
  const randomVerses: Verse[] = [
    {
      id: 1,
      verse_key: '1:1',
      text_uthmani: 'A',
      translations: [{ resource_id: 20, text: 'Translation A' }],
    },
    {
      id: 2,
      verse_key: '1:2',
      text_uthmani: 'B',
      translations: [{ resource_id: 20, text: 'Translation B' }],
    },
  ];

  mockedGetRandomVerse
    .mockResolvedValueOnce(randomVerses[0])
    .mockResolvedValueOnce(randomVerses[1]);

  mockedGetVerseByKey.mockResolvedValue({
    id: 100,
    verse_key: '2:255',
    text_uthmani: 'F',
    translations: [{ resource_id: 20, text: 'Translation F' }],
  } as Verse);

  await renderVerseOfDay({ randomVerseInterval: 2 });

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
