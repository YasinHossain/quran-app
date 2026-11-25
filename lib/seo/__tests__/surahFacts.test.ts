import { getServerTranslator } from '@/app/shared/i18n/serverLocale';
import {
  buildSurahFacts,
  buildSurahSummary,
  getJuzOfVerse,
  getSurahJuzRange,
} from '@/lib/seo/surahFacts';
import { SURAH_VERSE_COUNTS } from '@/lib/seo/surahSlugs';
import { localizeDigits } from '@/lib/text/localizeNumbers';

import type { Chapter } from '@/types';

const chapter = (overrides: Partial<Chapter> & Pick<Chapter, 'id'>): Chapter => ({
  name_simple: `Surah ${overrides.id}`,
  name_arabic: 'سورة',
  revelation_place: 'makkah',
  verses_count: SURAH_VERSE_COUNTS[overrides.id - 1] ?? 1,
  ...overrides,
});

describe('surah juz ranges', () => {
  it.each([
    [1, 1, 1],
    [2, 1, 3],
    [9, 10, 11],
    [18, 15, 16],
    [36, 22, 23],
    [96, 30, 30],
    [114, 30, 30],
  ])('surah %i spans juz %i to %i', (surahId, start, end) => {
    expect(getSurahJuzRange(surahId, SURAH_VERSE_COUNTS[surahId - 1]!)).toEqual({ start, end });
  });

  it('places juz boundaries on the right verses', () => {
    expect(getJuzOfVerse(2, 141)).toBe(1);
    expect(getJuzOfVerse(2, 142)).toBe(2);
    expect(getJuzOfVerse(78, 1)).toBe(30);
    expect(getJuzOfVerse(115, 1)).toBeNull();
  });

  it('gives every surah a juz range that never goes backwards through the Quran', () => {
    let previousEnd = 1;
    SURAH_VERSE_COUNTS.forEach((count, index) => {
      const juz = getSurahJuzRange(index + 1, count);
      expect(juz).not.toBeNull();
      expect(juz!.start).toBeGreaterThanOrEqual(previousEnd);
      expect(juz!.end).toBeGreaterThanOrEqual(juz!.start);
      previousEnd = juz!.end;
    });
    expect(previousEnd).toBe(30);
  });
});

describe('buildSurahFacts', () => {
  it('reads revelation place, verse count and pages from chapter data', () => {
    expect(buildSurahFacts(chapter({ id: 96, pages: [597, 597] }))).toEqual({
      id: 96,
      revelation: 'makkah',
      versesCount: 19,
      pages: { start: 597, end: 597 },
      juz: { start: 30, end: 30 },
      beginsWithoutBasmala: false,
    });
  });

  it('leaves out facts the data does not support instead of guessing', () => {
    const facts = buildSurahFacts(
      chapter({ id: 2, revelation_place: '', pages: [49, 2] as [number, number] })
    );
    expect(facts.revelation).toBeNull();
    expect(facts.pages).toBeNull();
    expect(buildSurahFacts(chapter({ id: 2, pages: [0, 700] })).pages).toBeNull();
    expect(buildSurahFacts(chapter({ id: 2 })).pages).toBeNull();
  });

  it('flags a missing Basmala only for a surah other than Al-Fatihah', () => {
    expect(buildSurahFacts(chapter({ id: 9, bismillah_pre: false })).beginsWithoutBasmala).toBe(
      true
    );
    expect(buildSurahFacts(chapter({ id: 1, bismillah_pre: false })).beginsWithoutBasmala).toBe(
      false
    );
    // Unknown (field missing) is not "without".
    expect(buildSurahFacts(chapter({ id: 9 })).beginsWithoutBasmala).toBe(false);
  });
});

describe('buildSurahSummary', () => {
  it('describes a one-page surah in English', async () => {
    const translator = await getServerTranslator('en');
    const facts = buildSurahFacts(chapter({ id: 96, pages: [597, 597] }));

    expect(
      buildSurahSummary({ t: translator.t, facts, name: 'Al-Alaq (The Clot)', digits: String })
    ).toEqual([
      'Al-Alaq (The Clot) is surah 96 of the 114 surahs of the Quran.',
      'It is a Meccan surah of 19 verses.',
      'It is on page 597 of the Mushaf, in Juz 30.',
    ]);
  });

  it('describes a long Medinan surah across several juz, with localized digits', async () => {
    const translator = await getServerTranslator('bn');
    const facts = buildSurahFacts(chapter({ id: 2, revelation_place: 'madinah', pages: [2, 49] }));
    const sentences = buildSurahSummary({
      t: translator.t,
      facts,
      name: 'আল-বাকারা',
      digits: (value) => localizeDigits(String(value), 'bn'),
    });

    expect(sentences).toHaveLength(3);
    expect(sentences[1]).toContain('মাদানী');
    expect(sentences[1]).toContain('২৮৬');
    expect(sentences[2]).toContain('৪৯');
    expect(sentences[2]).toContain('৩');
    expect(sentences.join(' ')).not.toMatch(/\d|\{\{/);
  });

  it('skips the location sentence when page data is missing', async () => {
    const translator = await getServerTranslator('en');
    const facts = buildSurahFacts(chapter({ id: 36, revelation_place: '' }));

    expect(buildSurahSummary({ t: translator.t, facts, name: 'Ya-Sin', digits: String })).toEqual([
      'Ya-Sin is surah 36 of the 114 surahs of the Quran.',
      'It has 83 verses.',
    ]);
  });
});
