import { buildSWRKeyFactory } from '@/app/(features)/surah/hooks/useInfiniteVerseLoader.fetcher';

describe('buildSWRKeyFactory', () => {
  it('includes resource kind in the key to prevent cache collisions', () => {
    const surahKey = buildSWRKeyFactory('surah', '1', '20', 'en', false)(0);
    const juzKey = buildSWRKeyFactory('juz', '1', '20', 'en', false)(0);
    const pageKey = buildSWRKeyFactory('page', '1', '20', 'en', false)(0);

    expect(surahKey).not.toEqual(juzKey);
    expect(surahKey).not.toEqual(pageKey);
    expect(juzKey).not.toEqual(pageKey);
  });

  it('defaults resource kind to surah when omitted', () => {
    const explicit = buildSWRKeyFactory('surah', '1', '20', 'en', false)(0);
    const implicit = buildSWRKeyFactory(undefined, '1', '20', 'en', false)(0);

    expect(implicit).toEqual(explicit);
  });
});
