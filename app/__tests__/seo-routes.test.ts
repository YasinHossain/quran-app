let mockUiLanguage = 'en';

jest.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-ui-language': mockUiLanguage }),
}));

jest.mock('@/lib/api/server', () => ({
  getJuzInitialDataServer: jest.fn(),
  // Plain function: the Jest config resets `jest.fn` implementations between tests.
  getChapterServer: async (id: number) => ({
    id,
    name_simple: 'Ya-Sin',
    name_arabic: 'يس',
    revelation_place: 'makkah',
    verses_count: 83,
    translated_name: { name: 'Ya Sin' },
  }),
}));

import { generateMetadata as generateJuzMetadata } from '@/app/(features)/juz/[juzId]/page';
import { generateMetadata as generateJuzIndexMetadata } from '@/app/(features)/juz/page';
import { generateMetadata as generateSurahMetadata } from '@/app/(features)/surah/[surahId]/page';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { ENABLED_LANGUAGES } from '@/app/shared/i18n/languageRegistry';
import { SEO_CONTENT_LAST_MODIFIED } from '@/lib/seo/sitemapEntries';

const BASE = 'http://localhost:3000';

const surahMetadata = (surahId: string) =>
  generateSurahMetadata({ params: Promise.resolve({ surahId }) });

describe('SEO routes', () => {
  afterEach(() => {
    mockUiLanguage = 'en';
  });

  it('keeps Next.js assets crawlable in robots.txt', () => {
    const config = robots();
    const firstRule = Array.isArray(config.rules) ? config.rules[0] : config.rules;

    expect(firstRule).toBeDefined();
    expect(firstRule?.disallow).not.toEqual(expect.arrayContaining(['/_next/']));
  });

  it('keeps juz routes indexable with descriptive metadata', async () => {
    const indexMetadata = await generateJuzIndexMetadata();
    expect(indexMetadata.robots).toBeUndefined();

    const metadata = await generateJuzMetadata({
      params: Promise.resolve({ juzId: '1' }),
    });

    expect(metadata.robots).toBeUndefined();
    expect(metadata.description).toContain('Juz 1');
    expect(metadata.description).toContain('Al-Faatiha');
    expect(metadata.alternates?.canonical).toBe(`${BASE}/juz/1`);
  });

  it('gives English pages an unprefixed self canonical and hreflang for every language', async () => {
    const metadata = await surahMetadata('36');

    expect(metadata.title).toBe('Surah Ya-Sin (36)');
    expect(metadata.alternates?.canonical).toBe(`${BASE}/surah/36`);
    expect(metadata.alternates?.languages).toEqual({
      en: `${BASE}/surah/36`,
      bn: `${BASE}/bn/surah/36`,
      ar: `${BASE}/ar/surah/36`,
      ur: `${BASE}/ur/surah/36`,
      hi: `${BASE}/hi/surah/36`,
      'x-default': `${BASE}/surah/36`,
    });
  });

  it.each([
    ['bn', 'সূরা', 'মাক্কী'],
    ['ur', 'سورۃ', 'مکی'],
    ['ar', 'سورة', 'مكية'],
    ['hi', 'सूरह', 'मक्की'],
  ])(
    'gives /%s pages a self canonical and localized title',
    async (code, surahWord, revelation) => {
      mockUiLanguage = code;
      const metadata = await surahMetadata('36');
      const { surah_names: surahNames } = (await import(`@/public/locales/${code}/common.json`))
        .default as { surah_names: Record<string, string> };
      const title = `${surahWord} ${surahNames['36']} (36)`;

      expect(metadata.alternates?.canonical).toBe(`${BASE}/${code}/surah/36`);
      expect(metadata.alternates?.canonical).not.toContain('__uiLanguage');
      expect(Object.keys(metadata.alternates?.languages ?? {})).toHaveLength(
        ENABLED_LANGUAGES.length + 1
      );
      expect(metadata.title).toBe(title);
      expect(metadata.description).toContain(revelation);
      expect(metadata.openGraph?.url).toBe(`${BASE}/${code}/surah/36`);
    }
  );

  it('lists every language version in the sitemap with hreflang alternates', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    // 262 localized routes x languages + 2 English-only legal pages.
    expect(entries).toHaveLength(262 * ENABLED_LANGUAGES.length + 2);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([`${BASE}/juz`, `${BASE}/bn/surah/36`]));
    expect(urls).not.toContain(`${BASE}/bn/privacy`);

    const bnSurah = entries.find((entry) => entry.url === `${BASE}/bn/surah/36`);
    expect(bnSurah?.alternates?.languages).toMatchObject({
      en: `${BASE}/surah/36`,
      ur: `${BASE}/ur/surah/36`,
      'x-default': `${BASE}/surah/36`,
    });
    expect(entries.every((entry) => entry.lastModified === SEO_CONTENT_LAST_MODIFIED)).toBe(true);
  });
});
