import { waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import { setMatchMedia } from '@/app/testUtils/matchMedia';

import type { getJuzList, getSurahList } from '@/lib/api';
import type { Juz, Surah } from '@/types';
import type { RenderResult } from '@testing-library/react';

export type CorePageApiMocks = {
  mockedGetSurahList: jest.MockedFunction<typeof getSurahList>;
  mockedGetJuzList: jest.MockedFunction<typeof getJuzList>;
};

type CorePageApis = {
  getSurahList: typeof getSurahList;
  getJuzList: typeof getJuzList;
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

export const createCorePageApiMocks = ({
  getSurahList,
  getJuzList,
}: CorePageApis): CorePageApiMocks => ({
  mockedGetSurahList: getSurahList as jest.MockedFunction<typeof getSurahList>,
  mockedGetJuzList: getJuzList as jest.MockedFunction<typeof getJuzList>,
});

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

export type AsyncRender = () => Promise<RenderResult>;

export const runAccessibilityAudit = async (renderPage: AsyncRender): Promise<void> => {
  const { container } = await renderPage();
  await expectNoAccessibilityViolations(container);
};

export const waitForSelector = async (root: QueryRoot, selector: string): Promise<void> => {
  await waitFor(() => {
    expect(root.querySelector(selector)).toBeInTheDocument();
  });
};

export const waitForPageHeading = async (root: QueryRoot, selector = 'h1'): Promise<void> => {
  await waitForSelector(root, selector);
};

export const expectVisibleHeading = (selector = 'h1'): void => {
  const heading = document.querySelector(selector);
  expect(heading).toBeInTheDocument();
  expect(heading).toBeVisible();
};

export const expectMainLandmark = (): void => {
  const main = document.querySelector('main');
  expect(main).toBeInTheDocument();
};

export const expectBookmarkListStructure = (): void => {
  const lists = document.querySelectorAll('[role="list"], ul, ol');
  expect(lists.length).toBeGreaterThan(0);
};

export const expectAccessibleSearchForm = ({
  inputSelector,
  labelFor,
}: {
  inputSelector: string;
  labelFor: string;
}): void => {
  const searchInput = document.querySelector<HTMLInputElement>(inputSelector);
  expect(searchInput).toHaveAttribute('aria-label');
  expect(searchInput).toHaveAttribute('id');

  const label = document.querySelector(`label[for="${labelFor}"]`);
  expect(label).toBeInTheDocument();
};

export const expectNavigationLandmarks = (): void => {
  expect(document.querySelectorAll('[role="navigation"], nav').length).toBeGreaterThan(0);
};

export const waitForNavigationElements = async (): Promise<void> => {
  await waitFor(() => {
    expectNavigationLandmarks();
  });
};
