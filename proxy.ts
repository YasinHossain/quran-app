import { NextResponse, type NextRequest } from 'next/server';

import { UI_LANGUAGE_HEADER, UI_LANGUAGE_QUERY_PARAM } from '@/app/shared/i18n/languageRegistry';
import {
  DEFAULT_UI_LANGUAGE,
  isUiLanguageCode,
  resolveUiLanguageTag,
  UI_LANGUAGE_STORAGE_KEY,
  type UiLanguageCode,
} from '@/app/shared/i18n/uiLanguages';
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

/**
 * Language for an unprefixed URL: the saved cookie, then Accept-Language, then the default.
 * Crawlers send neither, so they always get the default language with a 200.
 */
const getPreferredLocale = (request: NextRequest): UiLanguageCode => {
  const fromCookie = request.cookies.get(UI_LANGUAGE_STORAGE_KEY)?.value;
  if (fromCookie && isUiLanguageCode(fromCookie)) {
    return fromCookie;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return DEFAULT_UI_LANGUAGE;

  for (const part of acceptLanguage.split(',')) {
    const candidate = resolveUiLanguageTag(part.split(';')[0]);
    if (candidate) return candidate;
  }

  return DEFAULT_UI_LANGUAGE;
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

    // Canonicalize the default language: `/en/...` -> `/...` (permanent; no prefix for it).
    if (maybeLocale === DEFAULT_UI_LANGUAGE) {
      const response = NextResponse.redirect(url, 308);
      syncUiLanguageCookie(request, response, maybeLocale);
      return response;
    }

    // Important: make the rewrite destination unique per locale so Next's
    // client/router caches don't accidentally reuse RSC payloads across locales.
    url.searchParams.set(UI_LANGUAGE_QUERY_PARAM, maybeLocale);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(UI_LANGUAGE_HEADER, maybeLocale);

    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    syncUiLanguageCookie(request, response, maybeLocale);
    return response;
  }

  // No locale prefix: serve the default language, or send a returning/other-language user to
  // their language with a temporary redirect (it depends on the visitor, not the URL).
  const locale = getPreferredLocale(request);
  if (locale === DEFAULT_UI_LANGUAGE) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(UI_LANGUAGE_HEADER, locale);

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
