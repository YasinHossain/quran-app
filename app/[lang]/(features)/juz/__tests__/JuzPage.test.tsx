import { JuzClient } from '@/app/[lang]/(features)/juz/[juzId]/JuzClient';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import juzData from '@/data/juz.json';
import * as api from '@/lib/api';
import { buildJuzTitle, findJuzById, getJuzSurahRanges } from '@/lib/seo/juzSurahs';
import { getSurahSlug } from '@/lib/seo/surahSlugs';
import enCommon from '@/public/locales/en/common.json';
import { Verse } from '@/types';

import type { ServerTranslator } from '@/app/shared/i18n/serverLocale';
import type { JuzSummary } from '@/app/shared/navigation/types';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  const identity = <T,>(x: T): T => x;
  return { ...actual, use: identity };
});

const mockVerse: Verse = {
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'verse text',
  words: [],
} as Verse;
jest.mock('@/lib/api');

beforeAll(() => {
  setMatchMedia(false);
});

beforeEach(() => {
  (api.getTranslations as jest.Mock).mockResolvedValue([]);
  (api.getVersesByJuz as jest.Mock).mockResolvedValue({ verses: [mockVerse], totalPages: 1 });
});

const renderPage = (): void => {
  renderWithProviders(<JuzClient juzId="1" />);
};

test('renders verses for selected juz', async () => {
  renderPage();
  expect(await screen.findByText('verse text')).toBeInTheDocument();
  expect(api.getVersesByJuz).toHaveBeenCalled();
});

describe('surahs listed on a juz page', () => {
  const juzs = juzData as JuzSummary[];
  const getJuz = (number: number): JuzSummary => juzs.find((juz) => juz.number === number)!;
  const strings = enCommon as unknown as Record<string, unknown>;
  const surahNames = strings['surah_names'] as Record<string, string>;
  const translator: ServerTranslator = {
    locale: 'en',
    t: (key, vars = {}) =>
      String(strings[key] ?? key).replace(/\{\{\s*(\w+)[^}]*\}\}/g, (_m, name: string) =>
        String(vars[name])
      ),
    surahName: (id) => surahNames[String(id)]!,
    chapterName: (chapter) => chapter.name_simple,
  };

  it('lists every surah of juz 30 (78 to 114) with a canonical slug', () => {
    const ranges = getJuzSurahRanges(getJuz(30));
    expect(ranges).toHaveLength(37);
    expect(ranges[0]).toMatchObject({ surahId: 78, startAyah: 1, endAyah: 40 });
    expect(ranges[ranges.length - 1]!.surahId).toBe(114);
    ranges.forEach((range) => expect(range.slug).toBe(getSurahSlug(range.surahId)));
  });

  it('gives juz 1 Al-Fatihah 1-7 and Al-Baqarah 1-141, and juz 2 starts at Al-Baqarah 142', () => {
    expect(getJuzSurahRanges(getJuz(1))).toEqual([
      { surahId: 1, slug: 'al-fatihah', startAyah: 1, endAyah: 7 },
      { surahId: 2, slug: 'al-baqarah', startAyah: 1, endAyah: 141 },
    ]);
    expect(getJuzSurahRanges(getJuz(2))[0]).toMatchObject({ surahId: 2, startAyah: 142 });
  });

  it('matches the juz boundaries for every juz', () => {
    juzs.forEach((juz) => {
      const ranges = getJuzSurahRanges(juz);
      expect(ranges[0]).toMatchObject({ surahId: juz.startSurahId, startAyah: juz.startAyah });
      expect(ranges[ranges.length - 1]).toMatchObject({
        surahId: juz.endSurahId,
        endAyah: juz.endAyah,
      });
    });
  });

  it('names the first and last surah in the title, also for juz that start mid-surah', () => {
    expect(buildJuzTitle(translator, '30', getJuz(30))).toBe(
      'Juz 30 – Surahs An-Naba to An-Nas (78–114)'
    );
    expect(buildJuzTitle(translator, '2', getJuz(2))).toBe('Juz 2 – Surah Al-Baqarah (2)');
    expect(buildJuzTitle(translator, '99')).toBe('Juz 99');
  });

  it('only resolves juz 1 to 30 (others are a 404)', () => {
    ['0', '31', 'abc', '01', '1abc', '', '-1'].forEach((id) =>
      expect(findJuzById(id)).toBeUndefined()
    );
    expect(findJuzById('30')?.number).toBe(30);
    expect(juzs.every((juz) => findJuzById(String(juz.number))?.number === juz.number)).toBe(true);
  });
});
