/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

import { proxy } from '@/proxy';

const GOOGLEBOT_UA =
  'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

const request = (path: string, headers: Record<string, string> = {}): NextRequest =>
  new NextRequest(`https://appquran.com${path}`, {
    headers: { 'user-agent': GOOGLEBOT_UA, ...headers },
  });

describe('proxy locale routing', () => {
  it('serves unprefixed URLs in English with a 200 to crawlers (no cookie, no Accept-Language)', () => {
    const response = proxy(request('/surah/ya-sin'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
    expect(response.headers.get('x-middleware-request-x-ui-language')).toBe('en');
  });

  it('permanently redirects the default-language prefix to the unprefixed URL', () => {
    const response = proxy(request('/en/surah/ya-sin'));

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://appquran.com/surah/ya-sin');
  });

  it.each(['bn', 'ar', 'ur', 'hi'])(
    'rewrites /%s/... to the shared route with the language',
    (code) => {
      const response = proxy(request(`/${code}/surah/ya-sin`));

      expect(response.status).toBe(200);
      const rewrite = new URL(response.headers.get('x-middleware-rewrite') ?? '');
      expect(rewrite.pathname).toBe('/surah/ya-sin');
      expect(rewrite.searchParams.get('__uiLanguage')).toBe(code);
      expect(response.headers.get('x-middleware-request-x-ui-language')).toBe(code);
    }
  );

  it('keeps sending visitors to their language with a temporary redirect', () => {
    const fromHeader = proxy(
      request('/surah/ya-sin', { 'accept-language': 'bn-BD,bn;q=0.9,en;q=0.8' })
    );
    expect(fromHeader.status).toBe(307);
    expect(fromHeader.headers.get('location')).toBe('https://appquran.com/bn/surah/ya-sin');

    const fromCookie = proxy(request('/', { cookie: 'ui-language=ur' }));
    expect(fromCookie.status).toBe(307);
    expect(fromCookie.headers.get('location')).toBe('https://appquran.com/ur');
  });

  it('ignores unknown prefixes and languages', () => {
    const response = proxy(request('/fr/surah/ya-sin', { 'accept-language': 'fr-FR' }));

    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });
});

describe('proxy canonical surah slugs', () => {
  it.each([
    ['/2/255', '/surah/al-baqarah/255'],
    ['/bn/2/255', '/bn/surah/al-baqarah/255'],
    ['/en/2/255', '/surah/al-baqarah/255'],
    ['/114/6', '/surah/an-nas/6'],
    ['/surah/2', '/surah/al-baqarah'],
    ['/ur/surah/36', '/ur/surah/ya-sin'],
    ['/en/surah/36', '/surah/ya-sin'],
    ['/surah/2/255', '/surah/al-baqarah/255'],
    ['/surah/baqarah/255', '/surah/al-baqarah/255'],
    ['/surah/Al-Baqarah', '/surah/al-baqarah'],
    ['/hi/surah/yaseen/45', '/hi/surah/ya-sin/45'],
    ['/tafsir/2/255', '/tafsir/al-baqarah/255'],
    ['/ar/tafsir/fatiha/1', '/ar/tafsir/al-fatihah/1'],
    ['/2/255?ref=x', '/surah/al-baqarah/255?ref=x'],
    ['/surah/2/', '/surah/al-baqarah'],
    ['/surah/al-baqarah/', '/surah/al-baqarah'],
    ['/bn/surah/2/255/', '/bn/surah/al-baqarah/255'],
    ['/en/surah/2/255/?ref=x', '/surah/al-baqarah/255?ref=x'],
    ['/2/255/', '/surah/al-baqarah/255'],
    ['/tafsir/2/255/', '/tafsir/al-baqarah/255'],
    ['/about/', '/about'],
    ['/bn/juz/2/', '/bn/juz/2'],
  ])('redirects %s in one hop to %s', (path, target) => {
    const response = proxy(request(path));

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe(`https://appquran.com${target}`);
    // The target is final: requesting it does not redirect again.
    const next = proxy(request(target));
    expect(next.headers.get('location')).toBeNull();
  });

  it.each([
    '/surah/al-baqarah',
    '/surah/al-baqarah/255',
    '/bn/surah/al-baqarah/255',
    '/tafsir/al-baqarah/255',
    '/surah/not-a-surah', // unknown: 404, not a redirect
    '/surah/115',
    '/surah/0/1',
    '/115/1',
    '/02/255',
    '/2',
    '/2/255/1',
    '/fr/2/255',
    '/juz/30',
    '/bn/juz/2',
    '/page/2',
    '/search',
  ])('leaves %s alone', (path) => {
    const response = proxy(request(path));

    expect(response.headers.get('location')).toBeNull();
    expect(response.status).toBe(200);
  });

  it.each([
    '/surah/2/287',
    '/surah/2/0',
    '/surah/2/02',
    '/surah/baqarah/287',
    '/surah/1/abc',
    '/2/287',
    '/2/0',
    '/1/abc',
    '/bn/2/999',
    '/tafsir/2/999',
    '/tafsir/al-baqarah/999', // canonical slug: the route itself 404s
  ])('does not redirect the non-existent verse %s (it 404s directly)', (path) => {
    const response = proxy(request(path));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it.each([
    ['/2/255', { cookie: 'ui-language=bn' }, '/bn/surah/al-baqarah/255'],
    ['/surah/2/255/?ref=x', { cookie: 'ui-language=bn' }, '/bn/surah/al-baqarah/255?ref=x'],
    ['/surah/yaseen', { 'accept-language': 'ur-PK,ur;q=0.9' }, '/ur/surah/ya-sin'],
    ['/tafsir/2/255', { 'accept-language': 'ar' }, '/ar/tafsir/al-baqarah/255'],
    ['/about/', { cookie: 'ui-language=hi' }, '/hi/about'],
  ])(
    'sends %s with a language preference straight to its localized canonical URL',
    (path, headers, target) => {
      const response = proxy(request(path, headers));

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(`https://appquran.com${target}`);
      const next = proxy(request(target, headers));
      expect(next.headers.get('location')).toBeNull();
    }
  );

  it('keeps an explicit English cookie on the 308 to the unprefixed canonical URL', () => {
    const response = proxy(request('/2/255', { cookie: 'ui-language=en' }));

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://appquran.com/surah/al-baqarah/255');
  });

  it.each([
    '/2/255.png',
    '/sitemap.xml',
    '/sitemaps/verses-en.xml',
    '/64a6b60346f4c880149e28cb2fd090a8.txt',
    '/_next/static/chunks/2/255.js',
    '/api/quran/surah/2',
  ])('never touches %s', (path) => {
    const response = proxy(request(path));

    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });
});
