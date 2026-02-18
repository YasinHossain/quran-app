import { NextResponse, type NextRequest } from 'next/server';

import { isUiLanguageCode, UI_LANGUAGE_STORAGE_KEY } from '@/app/shared/i18n/uiLanguages';
import { SITE_DOMAIN } from '@/lib/seo/site';

const PUBLIC_FILE = /\.[^/]+$/;
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const isPrefetchRequest = (request: NextRequest): boolean => {
  // Next.js sets `x-middleware-prefetch` for router prefetches.
  // Browsers may also include `Purpose`/`Sec-Purpose` for speculative prefetching.
  const middlewarePrefetch = request.headers.get('x-middleware-prefetch');
  if (middlewarePrefetch) return true;

  const purpose = request.headers.get('purpose') ?? request.headers.get('sec-purpose');
  if (purpose && purpose.toLowerCase() === 'prefetch') return true;

  const nextRouterPrefetch = request.headers.get('next-router-prefetch');
  if (nextRouterPrefetch) return true;

  return false;
};

const syncUiLanguageCookie = (
  request: NextRequest,
  response: NextResponse,
  locale: string
): void => {
  // Never mutate cookies on prefetch requests; it can cause "language flip-flops"
  // (a stale locale-prefetch response overwriting the user's current choice).
  if (isPrefetchRequest(request)) return;

  const current = request.cookies.get(UI_LANGUAGE_STORAGE_KEY)?.value;
  if (current === locale) return;

  response.cookies.set(UI_LANGUAGE_STORAGE_KEY, locale, {
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
    sameSite: 'lax',
  });
};

const stripRegion = (languageTag: string): string =>
  String(languageTag).trim().toLowerCase().split(/[-_]/)[0] ?? '';

const getPreferredLocale = (request: NextRequest): string => {
  const fromCookie = request.cookies.get(UI_LANGUAGE_STORAGE_KEY)?.value;
  if (fromCookie && isUiLanguageCode(fromCookie)) {
    return fromCookie;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return 'en';

  const candidates = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0] ?? '')
    .map(stripRegion)
    .filter(Boolean);

  for (const candidate of candidates) {
    if (isUiLanguageCode(candidate)) {
      return candidate;
    }
  }

  return 'en';
};

const shouldBypassI18n = (pathname: string): boolean => {
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/api')) return true;
  if (pathname.startsWith('/offline')) return true;
  if (pathname === '/sw.js') return true;
  if (pathname.startsWith('/workbox-')) return true;
  return PUBLIC_FILE.test(pathname);
};

const normalizePathname = (pathname: string): string => {
  if (pathname.length <= 1) return pathname;
  if (!pathname.endsWith('/')) return pathname;
  return pathname.replace(/\/+$/, '');
};

export function proxy(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();

  // Canonical host: `www.` -> apex.
  // Only apply to the production domain; preview domains should not redirect.
  if (url.hostname.toLowerCase() === `www.${SITE_DOMAIN}`) {
    url.hostname = SITE_DOMAIN;
    return NextResponse.redirect(url, 308);
  }

  // Canonical path: strip trailing slashes (except `/`).
  const normalizedPathname = normalizePathname(url.pathname);
  if (normalizedPathname !== url.pathname) {
    url.pathname = normalizedPathname;
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = url;

  if (shouldBypassI18n(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split('/');
  const rawLocale = segments[1];
  const maybeLocale = rawLocale ? rawLocale.toLowerCase() : '';

  // Locale prefix present -> rewrite to existing (non-prefixed) routes.
  if (maybeLocale && isUiLanguageCode(maybeLocale)) {
    const strippedPath = `/${segments.slice(2).join('/')}`.replace(/\/$/, '') || '/';
    const url = request.nextUrl.clone();
    url.pathname = strippedPath === '' ? '/' : strippedPath;

    // Canonicalize English: `/en/...` -> `/<...>` (no locale prefix for default locale).
    if (maybeLocale === 'en') {
      const response = NextResponse.redirect(url);
      syncUiLanguageCookie(request, response, maybeLocale);
      return response;
    }

    // Important: make the rewrite destination unique per locale so Next's
    // client/router caches don't accidentally reuse RSC payloads across locales.
    url.searchParams.set('__uiLanguage', maybeLocale);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-ui-language', maybeLocale);

    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    syncUiLanguageCookie(request, response, maybeLocale);
    return response;
  }

  // No locale prefix -> redirect to preferred locale.
  const locale = getPreferredLocale(request);
  if (locale === 'en') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-ui-language', locale);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    syncUiLanguageCookie(request, response, locale);
    return response;
  }

  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  syncUiLanguageCookie(request, response, locale);
  return response;
}

export const config = {
  matcher: ['/((?!_next/|api/|offline$|offline/|sw\\.js$|workbox-).*)'],
};
