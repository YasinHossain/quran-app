import React from 'react';

import { VerseOfDay } from '@/app/(features)/home/components/VerseOfDay';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { getRandomVerse } from '@/lib/api';
import { getVerseByKey } from '@/lib/api/verses';
import { Verse } from '@/types';

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

export const mockedGetRandomVerse = getRandomVerse as jest.MockedFunction<typeof getRandomVerse>;
export const mockedGetVerseByKey = getVerseByKey as jest.MockedFunction<typeof getVerseByKey>;

export const renderVerseOfDay = (props?: Partial<React.ComponentProps<typeof VerseOfDay>>) =>
  renderWithProviders(<VerseOfDay {...props} />);

export const setupMatchMedia = () => {
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

export const resetTestMocks = () => {
  jest.useFakeTimers();
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  mockedGetRandomVerse.mockReset();
  mockedGetVerseByKey.mockReset();
};

export const restoreTimers = () => {
  jest.useRealTimers();
};

export type { Verse };
