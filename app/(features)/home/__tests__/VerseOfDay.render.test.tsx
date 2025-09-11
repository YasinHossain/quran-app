import { screen, waitFor } from '@testing-library/react';

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

it('shows error message when fetching verse fails', async () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

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

  await renderVerseOfDay();

  await waitFor(
    () => expect(screen.getByText(/Unable to connect to Quran service/)).toBeInTheDocument(),
    { timeout: 5000 }
  );

  global.setTimeout = originalSetTimeout;
  consoleSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});
