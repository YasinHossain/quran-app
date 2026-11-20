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
    const response = proxy(request('/surah/36'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
    expect(response.headers.get('x-middleware-request-x-ui-language')).toBe('en');
  });

  it('permanently redirects the default-language prefix to the unprefixed URL', () => {
    const response = proxy(request('/en/surah/36'));

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://appquran.com/surah/36');
  });

  it.each(['bn', 'ar', 'ur', 'hi'])(
    'rewrites /%s/... to the shared route with the language',
    (code) => {
      const response = proxy(request(`/${code}/surah/36`));

      expect(response.status).toBe(200);
      const rewrite = new URL(response.headers.get('x-middleware-rewrite') ?? '');
      expect(rewrite.pathname).toBe('/surah/36');
      expect(rewrite.searchParams.get('__uiLanguage')).toBe(code);
      expect(response.headers.get('x-middleware-request-x-ui-language')).toBe(code);
    }
  );

  it('keeps sending visitors to their language with a temporary redirect', () => {
    const fromHeader = proxy(
      request('/surah/36', { 'accept-language': 'bn-BD,bn;q=0.9,en;q=0.8' })
    );
    expect(fromHeader.status).toBe(307);
    expect(fromHeader.headers.get('location')).toBe('https://appquran.com/bn/surah/36');

    const fromCookie = proxy(request('/', { cookie: 'ui-language=ur' }));
    expect(fromCookie.status).toBe(307);
    expect(fromCookie.headers.get('location')).toBe('https://appquran.com/ur');
  });

  it('ignores unknown prefixes and languages', () => {
    const response = proxy(request('/fr/surah/36', { 'accept-language': 'fr-FR' }));

    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
  });
});
