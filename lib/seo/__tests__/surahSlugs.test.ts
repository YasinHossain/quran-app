import {
  COMMON_SPELLINGS,
  SURAH_SLUGS,
  getSurahAliasIndex,
  getSurahSlug,
  normalizeSurahKey,
  resolveSurahParam,
} from '@/lib/seo/surahSlugs';

describe('surah slugs', () => {
  it('has 114 unique, URL-safe slugs', () => {
    expect(SURAH_SLUGS).toHaveLength(114);
    expect(new Set(SURAH_SLUGS).size).toBe(114);
    for (const slug of SURAH_SLUGS) expect(slug).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
  });

  it.each([
    [1, 'al-fatihah'],
    [2, 'al-baqarah'],
    [3, 'ali-imran'],
    [5, 'al-maidah'],
    [36, 'ya-sin'],
    [67, 'al-mulk'],
    [114, 'an-nas'],
  ])('derives surah %i from name_simple as %s', (id, slug) => {
    expect(getSurahSlug(id)).toBe(slug);
  });

  it('has no slug outside 1-114', () => {
    expect(getSurahSlug(0)).toBeUndefined();
    expect(getSurahSlug(115)).toBeUndefined();
  });
});

describe('resolveSurahParam', () => {
  it('marks the canonical slug as canonical', () => {
    expect(resolveSurahParam('al-baqarah')).toEqual({ id: 2, slug: 'al-baqarah', canonical: true });
  });

  it.each([
    ['2', 'al-baqarah'],
    ['114', 'an-nas'],
    ['baqarah', 'al-baqarah'],
    ['Al-Baqara', 'al-baqarah'],
    ['AL_BAQARAH', 'al-baqarah'],
    ['yasin', 'ya-sin'],
    ['yaseen', 'ya-sin'],
    ['Ya%20Seen', 'ya-sin'],
    ['fatiha', 'al-fatihah'],
    ['mulk', 'al-mulk'],
    ['kahf', 'al-kahf'],
    ['rahman', 'ar-rahman'],
    ['ar-rahmaan', 'ar-rahman'],
    ['ikhlas', 'al-ikhlas'],
    ['falaq', 'al-falaq'],
    ['nas', 'an-nas'],
    ['waqiah', 'al-waqiah'],
    ['imran', 'ali-imran'],
    ['muzzammil', 'al-muzzammil'],
  ])('resolves %s to %s', (input, slug) => {
    expect(resolveSurahParam(input)).toMatchObject({ slug, canonical: false });
  });

  it.each(['', '0', '115', '02', 'surah', 'baqarahh-x', 'favicon.ico', 'a'.repeat(200)])(
    'rejects %s',
    (input) => {
      expect(resolveSurahParam(input)).toBeNull();
    }
  );

  it('resolves every slug with or without its article, and never to two surahs', () => {
    SURAH_SLUGS.forEach((slug, index) => {
      expect(resolveSurahParam(slug)?.id).toBe(index + 1);
      const bare = slug.replace(/^(?:al|an|ar|as|at|az|ad|adh|ash|ath)-/, '');
      expect(resolveSurahParam(bare)?.id).toBe(index + 1);
      expect(resolveSurahParam(slug.toUpperCase())?.id).toBe(index + 1);
    });
    // The index only keeps keys owned by exactly one surah, so lookups are unambiguous.
    const index = getSurahAliasIndex();
    const canonicalKeys = SURAH_SLUGS.map(normalizeSurahKey);
    expect(new Set(canonicalKeys).size).toBe(114);
    canonicalKeys.forEach((key, i) => expect(index.get(key)).toBe(i + 1));
  });

  it('keeps every listed common spelling unambiguous', () => {
    for (const [alias, id] of Object.entries(COMMON_SPELLINGS)) {
      expect([alias, resolveSurahParam(alias)?.id]).toEqual([alias, id]);
    }
  });
});
