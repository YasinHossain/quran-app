import { NextResponse, type NextRequest } from 'next/server';

import { UI_LANGUAGE_HEADER, UI_LANGUAGE_QUERY_PARAM } from '@/app/shared/i18n/languageRegistry';
import {
  DEFAULT_UI_LANGUAGE,
  isUiLanguageCode,
  resolveUiLanguageTag,
  UI_LANGUAGE_STORAGE_KEY,
  type UiLanguageCode,
} from '@/app/shared/i18n/uiLanguages';
import { getCanonicalQuranPath } from '@/lib/seo/canonicalQuranPath';
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

/**
 * Redirect to `pathname`, keeping the query string. Uses a plain `URL`: `NextURL` would put a
 * trailing slash back when the request had one.
 */
const redirectTo = (request: NextRequest, pathname: string, status: 307 | 308): NextResponse => {
  const target = new URL(request.nextUrl.href);
  target.pathname = pathname;
  return NextResponse.redirect(target, status);
};

/** `/surah/x` in `locale` -> `/bn/surah/x`; `/` -> `/bn`. */
const setLocalePrefix = (path: string, locale: UiLanguageCode): string =>
  path === '/' ? `/${locale}` : `/${locale}${path}`;

const normalizePathname = (pathname: string): string => {
  if (pathname.length <= 1) return pathname;
  if (!pathname.endsWith('/')) return pathname;
  return pathname.replace(/\/+$/, '');
};

/** `/<locale>/...`: canonical redirects (one hop), else a rewrite to the shared route. */
function handlePrefixedPath(
  request: NextRequest,
  input: {
    locale: UiLanguageCode;
    unprefixedPath: string;
    canonicalPath: string;
    needsRedirect: boolean;
  }
): NextResponse {
  const { locale, unprefixedPath, canonicalPath, needsRedirect } = input;

  // Canonicalize the default language: `/en/...` -> `/...` (permanent; no prefix for it).
  if (locale === DEFAULT_UI_LANGUAGE) {
    const response = redirectTo(request, canonicalPath, 308);
    syncUiLanguageCookie(request, response, locale);
    return response;
  }

  if (needsRedirect) return redirectTo(request, setLocalePrefix(canonicalPath, locale), 308);

  // Rewrite to the existing (non-prefixed) route. Important: make the rewrite destination unique
  // per locale so Next's client/router caches don't accidentally reuse RSC payloads across locales.
  const url = request.nextUrl.clone();
  url.pathname = unprefixedPath;
  url.searchParams.set(UI_LANGUAGE_QUERY_PARAM, locale);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(UI_LANGUAGE_HEADER, locale);

  const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  syncUiLanguageCookie(request, response, locale);
  return response;
}

export function proxy(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();

  // Canonical host: `www.` -> apex.
  // Only apply to the production domain; preview domains should not redirect.
  if (url.hostname.toLowerCase() === `www.${SITE_DOMAIN}`) {
    url.hostname = SITE_DOMAIN;
    return NextResponse.redirect(url, 308);
  }

  // Canonical path: no trailing slash (except `/`). Folded into the redirects below so every
  // non-canonical URL reaches its canonical form in one hop (`skipTrailingSlashRedirect` in
  // `next.config.ts` leaves this to the proxy).
  const pathname = normalizePathname(url.pathname);
  const hasTrailingSlash = pathname !== url.pathname;

  if (shouldBypassI18n(pathname)) {
    return hasTrailingSlash ? redirectTo(request, pathname, 308) : NextResponse.next();
  }

  const segments = pathname.split('/');
  const rawLocale = segments[1];
  const maybeLocale = rawLocale ? rawLocale.toLowerCase() : '';
  const prefixLocale = maybeLocale && isUiLanguageCode(maybeLocale) ? maybeLocale : null;
  const unprefixedPath = prefixLocale ? `/${segments.slice(2).join('/')}` : pathname;

  // Canonical surah/verse/tafsir URLs use the surah slug (`/surah/al-baqarah/255`). Numbers,
  // loose spellings and the `/2/255` shortcut redirect straight to it. Unknown surahs and verses
  // get no redirect and 404.
  const canonicalQuranPath = getCanonicalQuranPath(unprefixedPath);
  const canonicalPath = canonicalQuranPath ?? unprefixedPath;

  const needsRedirect = hasTrailingSlash || canonicalQuranPath !== null;

  if (prefixLocale) {
    return handlePrefixedPath(request, {
      locale: prefixLocale,
      unprefixedPath,
      canonicalPath,
      needsRedirect,
    });
  }

  // No locale prefix: send a returning/other-language visitor to their language (canonical form
  // included) with one temporary redirect, since it depends on the visitor, not the URL.
  const locale = getPreferredLocale(request);
  if (locale !== DEFAULT_UI_LANGUAGE) {
    const response = redirectTo(request, setLocalePrefix(canonicalPath, locale), 307);
    syncUiLanguageCookie(request, response, locale);
    return response;
  }

  // Default language (and every crawler): one permanent redirect to the canonical URL, if needed.
  if (needsRedirect) return redirectTo(request, canonicalPath, 308);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(UI_LANGUAGE_HEADER, locale);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  syncUiLanguageCookie(request, response, locale);
  return response;
}

export const config = {
  matcher: ['/((?!_next/|api/|offline$|offline/|sw\\.js$|workbox-).*)'],
};
