import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { SWRConfig } from 'swr';
import * as swrModule from 'swr';

import { useSingleVerse } from '@/app/shared/hooks/useSingleVerse';

import type { Verse } from '@/types';

jest.mock('@/app/providers/SettingsContext', () => ({
  useSettings: jest.fn(),
}));

jest.mock('@/lib/api/verses', () => ({
  getVerseById: jest.fn(),
  getVerseByKey: jest.fn(),
}));

const { useSettings } = jest.requireMock('@/app/providers/SettingsContext') as {
  useSettings: jest.Mock;
};
const { getVerseById, getVerseByKey } = jest.requireMock('@/lib/api/verses') as {
  getVerseById: jest.Mock;
  getVerseByKey: jest.Mock;
};

const createWrapper = (): React.FC<React.PropsWithChildren> => {
  return ({ children }) => (
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
        errorRetryInterval: 0,
        errorRetryCount: 0,
      }}
    >
      {children}
    </SWRConfig>
  );
};

const sampleVerse = (overrides: Partial<Verse> = {}): Verse => ({
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'Bismillahir Rahmanir Rahim',
  translations: [],
  words: [],
  ...overrides,
});

describe('useSingleVerse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettings.mockReturnValue({
      settings: {
        translationIds: [20, 22],
        translationId: 20,
        wordLang: 'en',
      },
    });
  });

  it('fetches by verse id when identifier has no separator', async () => {
    const verse = sampleVerse({ id: 262, verse_key: '2:255' });
    getVerseById.mockResolvedValue(verse);

    const { result } = renderHook(() => useSingleVerse({ idOrKey: '262' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.verse).toEqual(verse));

    expect(getVerseById).toHaveBeenCalledWith('262', [20, 22], 'en');
    expect(getVerseByKey).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('fetches by verse key and falls back to translationId when array empty', async () => {
    useSettings.mockReturnValue({
      settings: {
        translationIds: [],
        translationId: 30,
        wordLang: 'bn',
      },
    });
    const verse = sampleVerse({ verse_key: '2:255' });
    getVerseByKey.mockResolvedValue(verse);

    const { result } = renderHook(() => useSingleVerse({ idOrKey: '2:255' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.verse).toEqual(verse));

    expect(getVerseByKey).toHaveBeenCalledWith('2:255', [30], 'bn');
    expect(getVerseById).not.toHaveBeenCalled();
  });

  it('exposes an error message when fetch fails', async () => {
    getVerseById.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useSingleVerse({ idOrKey: '10' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.error).toBe('boom'));
    expect(result.current.verse).toBeUndefined();
  });

  it('includes translation ids and word language in SWR cache key', () => {
    const useSWRSpy = jest.spyOn(swrModule, 'default');
    const mutateMock = jest.fn();
    let capturedKey: unknown;

    useSWRSpy.mockImplementation((key: unknown) => {
      capturedKey = key;
      return {
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: mutateMock,
      } as unknown as ReturnType<typeof swrModule.default>;
    });

    try {
      renderHook(() => useSingleVerse({ idOrKey: '2:255' }), {
        wrapper: createWrapper(),
      });

      expect(capturedKey).toEqual(['single-verse', '2:255', '20,22', 'en']);
    } finally {
      useSWRSpy.mockRestore();
    }
  });
});
