import { waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import { setMatchMedia } from '@/app/testUtils/matchMedia';

import type { getJuzList, getSurahList } from '@/lib/api';
import type { Juz, Surah } from '@/types';

type CorePageApiMocks = {
  mockedGetSurahList: jest.MockedFunction<typeof getSurahList>;
  mockedGetJuzList: jest.MockedFunction<typeof getJuzList>;
};

type QueryRoot = Document | Element;

const SURAH_FIXTURE: ReadonlyArray<Surah> = [
  {
    number: 1,
    name: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    verses: 7,
    meaning: 'The Opening',
  },
  {
    number: 2,
    name: 'Al-Baqarah',
    arabicName: 'البقرة',
    verses: 286,
    meaning: 'The Cow',
  },
];

const JUZ_FIXTURE: ReadonlyArray<Juz> = [
  {
    id: 1,
    juz_number: 1,
    verse_mapping: {
      '1:1': '1:7',
      '2:1': '2:141',
    },
    first_verse_id: 1,
    last_verse_id: 148,
    verses_count: 148,
  },
  {
    id: 2,
    juz_number: 2,
    verse_mapping: {
      '2:142': '2:252',
    },
    first_verse_id: 149,
    last_verse_id: 259,
    verses_count: 111,
  },
];

const createSurahFixture = (): Surah[] => SURAH_FIXTURE.map((surah) => ({ ...surah }));

const createJuzFixture = (): Juz[] =>
  JUZ_FIXTURE.map((juz) => ({
    ...juz,
    verse_mapping: { ...juz.verse_mapping },
  }));

export const setupCorePageAccessibilitySuite = ({
  mockedGetSurahList,
  mockedGetJuzList,
}: CorePageApiMocks): void => {
  beforeAll(() => {
    setMatchMedia(false);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetSurahList.mockResolvedValue(createSurahFixture());
    mockedGetJuzList.mockResolvedValue(createJuzFixture());
  });
};

export const expectNoAccessibilityViolations = async (container: HTMLElement): Promise<void> => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

export const waitForSelector = async (root: QueryRoot, selector: string): Promise<void> => {
  await waitFor(() => {
    expect(root.querySelector(selector)).toBeInTheDocument();
  });
};

export const waitForNavigationElements = async (): Promise<void> => {
  await waitFor(() => {
    expect(document.querySelectorAll('[role="navigation"], nav').length).toBeGreaterThan(0);
  });
};
