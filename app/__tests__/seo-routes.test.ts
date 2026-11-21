let mockUiLanguage = 'en';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: () => {
    throw Object.assign(new Error('NEXT_HTTP_ERROR_FALLBACK;404'), {
      digest: 'NEXT_HTTP_ERROR_FALLBACK;404',
    });
  },
}));

jest.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-ui-language': mockUiLanguage }),
}));

const CHAPTERS = [
  { id: 1, name_simple: 'Al-Fatihah', name_arabic: 'الفاتحة', verses_count: 7 },
  { id: 2, name_simple: 'Al-Baqarah', name_arabic: 'البقرة', verses_count: 286 },
];
let mockVerseText: string | undefined = 'Allāh - there is no deity except Him, the Ever-Living';

jest.mock('@/lib/api/server', () => ({
  getJuzInitialDataServer: jest.fn(),
  getChaptersServer: async () => CHAPTERS,
  toVerseCounts: (chapters: typeof CHAPTERS) => chapters.map((c) => c.verses_count),
  getVersePageVersesServer: async (input: {
    verseKey: string;
    globalVerseId: number;
    translationIds: number[];
  }) => {
    if (mockVerseText === undefined) throw new Error('upstream down');
    const verse = {
      id: input.globalVerseId,
      verseKey: input.verseKey,
      arabic: 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ',
      translations: input.translationIds.map((resourceId) => ({ resourceId, html: mockVerseText })),
    };
    return { verse, context: [verse] };
  },
  getTafsirVersePageDataServer: async ({ verseKey }: { verseKey: string }) => ({
    verse: { verse_key: verseKey, text_uthmani: 'ٱللَّهُ', translations: [] },
    tafsirHtml: '<p>Tafsir</p>',
    tafsirResource: undefined,
  }),
  getVersePageTafsirServer: async () => undefined,
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
import { generateMetadata as generateVerseMetadata } from '@/app/(features)/surah/[surahId]/[verseId]/page';
import { generateMetadata as generateSurahMetadata } from '@/app/(features)/surah/[surahId]/page';
import TafsirVersePage, {
  generateMetadata as generateTafsirMetadata,
} from '@/app/(features)/tafsir/[surahId]/[ayahId]/page';
import robots from '@/app/robots';
import { ENABLED_LANGUAGES } from '@/app/shared/i18n/languageRegistry';
import {
  SEO_CONTENT_LAST_MODIFIED,
  SITEMAP_CHILD_IDS,
  buildSitemapChild,
  sitemapChildUrl,
} from '@/lib/seo/sitemapEntries';
import { renderSitemapIndexXml, renderSitemapXml } from '@/lib/seo/sitemapXml';

const BASE = 'http://localhost:3000';

const surahMetadata = (surahId: string) =>
  generateSurahMetadata({ params: Promise.resolve({ surahId }) });

describe('SEO routes', () => {
  afterEach(() => {
    mockUiLanguage = 'en';
    mockVerseText = 'Allāh - there is no deity except Him, the Ever-Living';
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
    const metadata = await surahMetadata('ya-sin');

    expect(metadata.title).toBe('Surah Ya-Sin (36)');
    expect(metadata.alternates?.canonical).toBe(`${BASE}/surah/ya-sin`);
    expect(metadata.alternates?.languages).toEqual({
      en: `${BASE}/surah/ya-sin`,
      bn: `${BASE}/bn/surah/ya-sin`,
      ar: `${BASE}/ar/surah/ya-sin`,
      ur: `${BASE}/ur/surah/ya-sin`,
      hi: `${BASE}/hi/surah/ya-sin`,
      'x-default': `${BASE}/surah/ya-sin`,
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
      const metadata = await surahMetadata('ya-sin');
      const { surah_names: surahNames } = (await import(`@/public/locales/${code}/common.json`))
        .default as { surah_names: Record<string, string> };
      const title = `${surahWord} ${surahNames['36']} (36)`;

      expect(metadata.alternates?.canonical).toBe(`${BASE}/${code}/surah/ya-sin`);
      expect(metadata.alternates?.canonical).not.toContain('__uiLanguage');
      expect(Object.keys(metadata.alternates?.languages ?? {})).toHaveLength(
        ENABLED_LANGUAGES.length + 1
      );
      expect(metadata.title).toBe(title);
      expect(metadata.description).toContain(revelation);
      expect(metadata.openGraph?.url).toBe(`${BASE}/${code}/surah/ya-sin`);
    }
  );

  it('keeps the site social image, with size and alt, on surah, verse and tafsir pages', async () => {
    const pages = {
      surah: await surahMetadata('al-baqarah'),
      verse: await generateVerseMetadata({
        params: Promise.resolve({ surahId: 'al-baqarah', verseId: '255' }),
      }),
      tafsir: await generateTafsirMetadata({
        params: Promise.resolve({ surahId: 'al-baqarah', ayahId: '255' }),
      }),
    };

    for (const metadata of Object.values(pages)) {
      expect(metadata.openGraph?.images).toEqual([
        expect.objectContaining({
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: expect.any(String),
        }),
      ]);
      expect(metadata.twitter).toMatchObject({
        card: 'summary_large_image',
        images: [expect.objectContaining({ url: '/twitter-image' })],
      });
      // The page's own text still wins over the root layout's.
      expect(metadata.openGraph?.url).toContain('/al-baqarah');
    }
  });

  it('lists core pages in every language with hreflang alternates', () => {
    const entries = buildSitemapChild('core', []) ?? [];
    const urls = entries.map((entry) => entry.url);

    // 148 localized routes (4 indexes, 114 surahs, 30 juz) x languages + 2 English-only legal pages.
    expect(entries).toHaveLength(148 * ENABLED_LANGUAGES.length + 2);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toEqual(expect.arrayContaining([`${BASE}/juz`, `${BASE}/bn/surah/ya-sin`]));
    expect(urls).not.toContain(`${BASE}/bn/privacy`);

    const bnSurah = entries.find((entry) => entry.url === `${BASE}/bn/surah/ya-sin`);
    expect(bnSurah?.alternates?.languages).toMatchObject({
      en: `${BASE}/surah/ya-sin`,
      ur: `${BASE}/ur/surah/ya-sin`,
      'x-default': `${BASE}/surah/ya-sin`,
    });
    expect(entries.every((entry) => entry.lastModified === SEO_CONTENT_LAST_MODIFIED)).toBe(true);
  });

  it('splits the sitemap into core, per-language verse and per-language tafsir children', () => {
    expect(SITEMAP_CHILD_IDS).toEqual([
      'core',
      'verses-en',
      'verses-bn',
      'verses-ar',
      'verses-ur',
      'verses-hi',
      // Hindi uses the English tafsir, so its tafsir pages are not listed.
      'tafsir-en',
      'tafsir-bn',
      'tafsir-ar',
      'tafsir-ur',
    ]);

    const verseCounts = [7, 286];
    const verses = buildSitemapChild('verses-bn', verseCounts) ?? [];
    expect(verses).toHaveLength(293);
    expect(verses[7]?.url).toBe(`${BASE}/bn/surah/al-baqarah/1`);
    expect(verses.at(-1)?.alternates?.languages).toMatchObject({
      en: `${BASE}/surah/al-baqarah/286`,
      'x-default': `${BASE}/surah/al-baqarah/286`,
    });

    const tafsir = buildSitemapChild('tafsir-ur', verseCounts) ?? [];
    expect(tafsir).toHaveLength(293);
    expect(tafsir[0]?.url).toBe(`${BASE}/ur/tafsir/al-fatihah/1`);
    // Hindi tafsir pages duplicate the English text, so they are not an alternate.
    expect(tafsir[0]?.alternates?.languages).toEqual({
      en: `${BASE}/tafsir/al-fatihah/1`,
      bn: `${BASE}/bn/tafsir/al-fatihah/1`,
      ar: `${BASE}/ar/tafsir/al-fatihah/1`,
      ur: `${BASE}/ur/tafsir/al-fatihah/1`,
      'x-default': `${BASE}/tafsir/al-fatihah/1`,
    });
    expect(renderSitemapXml(buildSitemapChild('tafsir-en', [7]) ?? [])).not.toContain(
      'hreflang="hi"'
    );

    expect(buildSitemapChild('tafsir-hi', verseCounts)).toBeNull();
    expect(buildSitemapChild('verses-fr', verseCounts)).toBeNull();
  });

  it('serves a sitemap index of the children and valid child XML', () => {
    const index = renderSitemapIndexXml(
      SITEMAP_CHILD_IDS.map((id) => ({ url: sitemapChildUrl(id) }))
    );
    expect(index).toContain('<sitemapindex');
    expect(index.match(/<sitemap>/g)).toHaveLength(SITEMAP_CHILD_IDS.length);
    expect(index).toContain(`<loc>${BASE}/sitemaps/verses-hi.xml</loc>`);

    const child = renderSitemapXml(buildSitemapChild('verses-en', [7]) ?? []);
    expect(child.match(/<url>/g)).toHaveLength(7);
    expect(child).toContain(
      `<xhtml:link rel="alternate" hreflang="bn" href="${BASE}/bn/surah/al-fatihah/7" />`
    );
  });

  describe('verse pages', () => {
    const verseMetadata = (surahId: string, verseId: string) =>
      generateVerseMetadata({ params: Promise.resolve({ surahId, verseId }) });

    it('leads the title with the translation and self-canonicalizes', async () => {
      const metadata = await verseMetadata('al-baqarah', '255');

      expect(metadata.title).toBe('Surah Al-Baqarah 2:255 – Allāh - there is no deity except Him…');
      expect(metadata.description).toMatch(/^Allāh - there is no deity except Him/);
      expect(metadata.alternates?.canonical).toBe(`${BASE}/surah/al-baqarah/255`);
      expect(metadata.alternates?.languages).toMatchObject({
        bn: `${BASE}/bn/surah/al-baqarah/255`,
        'x-default': `${BASE}/surah/al-baqarah/255`,
      });
      expect(Object.keys(metadata.alternates?.languages ?? {})).toHaveLength(
        ENABLED_LANGUAGES.length + 1
      );
    });

    it('localizes the title and canonical', async () => {
      mockUiLanguage = 'bn';
      const metadata = await verseMetadata('al-baqarah', '255');

      expect(metadata.title).toMatch(/^সূরা .+ ২:২৫৫ \(2:255\) – Allāh/);
      expect(metadata.alternates?.canonical).toBe(`${BASE}/bn/surah/al-baqarah/255`);
    });

    it('falls back to generic wording when the verse cannot be loaded', async () => {
      mockVerseText = undefined;
      const metadata = await verseMetadata('al-fatihah', '7');

      expect(metadata.title).toBe('Surah Al-Fatihah 1:7');
      expect(metadata.description).toContain('with Arabic text, translation and tafsir');
    });

    it.each([
      ['al-baqarah', '287'],
      ['al-baqarah', '0'],
      ['ali-imran', '1'], // not in the mocked chapter data
      ['al-baqarah', 'abc'],
      ['not-a-surah', '1'],
    ])('404s for %s:%s', async (surahId, verseId) => {
      await expect(verseMetadata(surahId, verseId)).rejects.toMatchObject({
        digest: expect.stringContaining('404'),
      });
    });
  });

  describe('tafsir pages', () => {
    const tafsirParams = (surahId: string, ayahId: string) => ({
      params: Promise.resolve({ surahId, ayahId }),
    });

    it('is indexable with hreflang for the languages that have their own tafsir', async () => {
      const metadata = await generateTafsirMetadata(tafsirParams('al-baqarah', '255'));

      expect(metadata.robots).toBeUndefined();
      expect(metadata.alternates?.canonical).toBe(`${BASE}/tafsir/al-baqarah/255`);
      expect(Object.keys(metadata.alternates?.languages ?? {})).toEqual([
        'en',
        'bn',
        'ar',
        'ur',
        'x-default',
      ]);
    });

    it('keeps /hi tafsir pages (English tafsir text) out of the index', async () => {
      mockUiLanguage = 'hi';
      const metadata = await generateTafsirMetadata(tafsirParams('al-baqarah', '255'));

      expect(metadata.robots).toEqual({ index: false, follow: true });
      expect(metadata.alternates?.languages).not.toHaveProperty('hi');
    });

    it.each([
      ['al-baqarah', '999'],
      ['al-baqarah', '287'],
      ['al-baqarah', '0'],
      ['al-baqarah', 'abc'],
      ['al-baqarah', '02'],
      ['not-a-surah', '1'],
    ])('404s for %s:%s', async (surahId, ayahId) => {
      const notFound = { digest: expect.stringContaining('404') };
      await expect(generateTafsirMetadata(tafsirParams(surahId, ayahId))).rejects.toMatchObject(
        notFound
      );
      await expect(TafsirVersePage(tafsirParams(surahId, ayahId))).rejects.toMatchObject(notFound);
    });
  });
});
