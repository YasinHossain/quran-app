import React from 'react';

import { VerseOfDay } from '@/app/(features)/home/components/VerseOfDay';
import { renderWithProvidersAsync } from '@/app/testUtils/renderWithProviders';
import { getRandomVerse, getVerseByKey } from '@/lib/api';
import { Verse } from '@/types';

const originalRandomVerseEnv = process.env.NEXT_PUBLIC_ENABLE_RANDOM_VERSE_API;

jest.mock('@/lib/api', () => ({
  __esModule: true,
  getRandomVerse: jest.fn(),
  getSurahList: jest.fn(),
  getVerseByKey: jest.fn(),
}));

jest.mock('@/app/shared/navigation/hooks/useSurahNavigationData', () => ({
  __esModule: true,
  useSurahNavigationData: () => ({
    chapters: [
      {
        id: 1,
        name_simple: 'Al-Fatihah',
        name_arabic: 'الفاتحة',
        revelation_place: 'makkah',
        verses_count: 7,
      },
    ],
    surahs: [
      {
        number: 1,
        name: 'Al-Fatihah',
        arabicName: 'الفاتحة',
        verses: 7,
        meaning: 'The Opening',
      },
    ],
    isLoading: false,
    error: undefined,
  }),
}));

export const mockedGetRandomVerse = getRandomVerse as jest.MockedFunction<typeof getRandomVerse>;
export const mockedGetVerseByKey = getVerseByKey as jest.MockedFunction<typeof getVerseByKey>;

export const renderVerseOfDay = async (
  props?: Partial<React.ComponentProps<typeof VerseOfDay>>
): Promise<ReturnType<typeof renderWithProvidersAsync>> =>
  renderWithProvidersAsync(<VerseOfDay {...props} />);

export const setupMatchMedia = (): void => {
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
};

export const resetTestMocks = (): void => {
  jest.useFakeTimers();
  process.env.NEXT_PUBLIC_ENABLE_RANDOM_VERSE_API = 'true';
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  mockedGetRandomVerse.mockReset();
  mockedGetVerseByKey.mockReset();
};

export const restoreTimers = (): void => {
  jest.useRealTimers();
  process.env.NEXT_PUBLIC_ENABLE_RANDOM_VERSE_API = originalRandomVerseEnv;
};

export type { Verse };
