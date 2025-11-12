import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { SWRConfig } from 'swr';

import { useRandomVerse } from '@/app/(features)/home/hooks/useRandomVerse';
import { getRandomVerse } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';

jest.mock('@/lib/api', () => ({
  getRandomVerse: jest.fn(),
}));

const originalRandomVerseEnv = process.env.NEXT_PUBLIC_ENABLE_RANDOM_VERSE_API;

beforeAll(() => {
  process.env.NEXT_PUBLIC_ENABLE_RANDOM_VERSE_API = 'true';
});

afterAll(() => {
  process.env.NEXT_PUBLIC_ENABLE_RANDOM_VERSE_API = originalRandomVerseEnv;
});

describe('useRandomVerse', () => {
  it('logs warning when API fails', async () => {
    (getRandomVerse as jest.Mock).mockRejectedValue(new Error('fail'));
    const warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => {});

    const wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
      <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
    );

    const { result } = renderHook(() => useRandomVerse({ translationId: 1 }), { wrapper });

    await waitFor(() => expect(result.current.isAvailable).toBe(false));
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
