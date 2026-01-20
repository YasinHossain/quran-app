describe('search navigation intent', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.NEXT_PUBLIC_USE_QURAN_FOUNDATION_SEARCH;
  });

  it('parses explicit navigation queries', async () => {
    const { analyzeQuery } = await import('@/lib/api/search');

    expect(analyzeQuery('page 2')).toEqual(
      expect.objectContaining({
        type: 'navigation',
        navigationType: 'page',
        isExplicit: true,
        value: 2,
      })
    );

    expect(analyzeQuery('juz 30')).toEqual(
      expect.objectContaining({
        type: 'navigation',
        navigationType: 'juz',
        isExplicit: true,
        value: 30,
      })
    );

    expect(analyzeQuery('surah 2')).toEqual(
      expect.objectContaining({
        type: 'navigation',
        navigationType: 'surah',
        isExplicit: true,
        value: 2,
      })
    );

    expect(analyzeQuery('2')).toEqual(
      expect.objectContaining({
        type: 'navigation',
        navigationType: 'surah',
        isExplicit: false,
        value: 2,
      })
    );
  });

  it('returns exact navigation result for explicit page query without fetching', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch');
    const { quickSearch } = await import('@/lib/api/search');

    const result = await quickSearch('page 2');

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.verses).toEqual([]);
    expect(result.navigation).toEqual([{ resultType: 'page', key: 2, name: 'Page 2' }]);
  });

  it('returns exact navigation result for explicit surah query without fetching', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch');
    const { quickSearch } = await import('@/lib/api/search');

    const result = await quickSearch('surah 2');

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.verses).toEqual([]);
    expect(result.navigation).toEqual([{ resultType: 'surah', key: 2, name: 'Surah 2' }]);
  });
});
