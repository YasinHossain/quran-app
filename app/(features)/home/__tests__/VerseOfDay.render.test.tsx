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

  mockedGetRandomVerse.mockRejectedValue(new Error('fail'));
  mockedGetVerseByKey.mockResolvedValue({
    id: 100,
    verse_key: '2:255',
    text_uthmani: 'F',
    translations: [],
  } as Verse);

  await renderVerseOfDay();
  // Advance any scheduled timers deterministically instead of monkeypatching setTimeout
  jest.runOnlyPendingTimers();

  await waitFor(
    () =>
      expect(
        screen.getByText(/(Unable to connect to Quran service|Failed to load verse)/i)
      ).toBeInTheDocument(),
    { timeout: 5000 }
  );

  consoleSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});
