import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

import { getRandomVerse } from '@/lib/api';
import { Verse } from '@/types';

import { useRandomVerse, RETRY_LIMIT } from '../hooks/useRandomVerse';

jest.mock('@/lib/api', () => ({
  getRandomVerse: jest.fn(),
}));

describe('useRandomVerse', () => {
  const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  );

  const mockVerse: Verse = {
    id: 1,
    verse_key: '1:1',
    text_uthmani: 'بِسْمِ اللّهِ',
    translations: [
      {
        resource_id: 1,
        text: 'In the name of Allah',
      },
    ],
  } as Verse;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retries only after defined attempts', async () => {
    (getRandomVerse as jest.Mock)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(mockVerse);

    const { result } = renderHook(() => useRandomVerse({ translationId: 1 }), { wrapper });

    await waitFor(() => expect(result.current.isAvailable).toBe(false));
    expect(getRandomVerse).toHaveBeenCalledTimes(1);

    for (let i = 0; i < RETRY_LIMIT - 1; i++) {
      act(() => result.current.refresh());
      await waitFor(() => expect(result.current.isAvailable).toBe(false));
      expect(getRandomVerse).toHaveBeenCalledTimes(1);
    }

    act(() => result.current.refresh());

    await waitFor(() => expect(result.current.isAvailable).toBe(true));
    await waitFor(() => expect(result.current.verse).toEqual(mockVerse));
    expect(getRandomVerse).toHaveBeenCalledTimes(2);
  });

  it('fetches immediately after successful retry', async () => {
    (getRandomVerse as jest.Mock)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue(mockVerse);

    const { result } = renderHook(() => useRandomVerse({ translationId: 1 }), { wrapper });

    await waitFor(() => expect(result.current.isAvailable).toBe(false));

    for (let i = 0; i < RETRY_LIMIT; i++) {
      act(() => result.current.refresh());
    }

    await waitFor(() => expect(result.current.verse).toEqual(mockVerse));
    expect(getRandomVerse).toHaveBeenCalledTimes(2);

    act(() => result.current.refresh());
    await waitFor(() => expect(getRandomVerse).toHaveBeenCalledTimes(3));
  });
});
