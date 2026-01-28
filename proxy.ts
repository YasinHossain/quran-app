import { NextResponse, type NextRequest } from 'next/server';

import { isUiLanguageCode, UI_LANGUAGE_STORAGE_KEY } from '@/app/shared/i18n/uiLanguages';

const PUBLIC_FILE = /\.[^/]+$/;

const stripRegion = (languageTag: string): string =>
  String(languageTag).trim().toLowerCase().split(/[-_]/)[0] ?? '';

const isDocumentNavigation = (request: NextRequest): boolean => {
  const dest = request.headers.get('sec-fetch-dest');
  const mode = request.headers.get('sec-fetch-mode');
  if (dest === 'document' || mode === 'navigate') return true;

  const accept = request.headers.get('accept') ?? '';
  return accept.includes('text/html');
};

const setUiLanguageCookie = (
  request: NextRequest,
  response: NextResponse,
  uiLanguage: string
): void => {
  // Only persist locale on real document navigations (not RSC/prefetch fetches).
  // Otherwise, background prefetches can race and overwrite the user's selection.
  if (!isDocumentNavigation(request)) return;

  response.cookies.set(UI_LANGUAGE_STORAGE_KEY, uiLanguage, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
};

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

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (shouldBypassI18n(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  // Locale prefix present -> rewrite to existing (non-prefixed) routes.
  if (maybeLocale && isUiLanguageCode(maybeLocale)) {
    const strippedPath = `/${segments.slice(2).join('/')}`.replace(/\/$/, '') || '/';
    const url = request.nextUrl.clone();
    url.pathname = strippedPath === '' ? '/' : strippedPath;

    // Canonicalize English: `/en/...` -> `/<...>` (no locale prefix for default locale).
    if (maybeLocale === 'en') {
      const response = NextResponse.redirect(url);
      setUiLanguageCookie(request, response, maybeLocale);
      return response;
    }

    // Important: make the rewrite destination unique per locale so Next's
    // client/router caches don't accidentally reuse RSC payloads across locales.
    url.searchParams.set('__uiLanguage', maybeLocale);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-ui-language', maybeLocale);

    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    setUiLanguageCookie(request, response, maybeLocale);
    return response;
  }

  // No locale prefix -> redirect to preferred locale.
  const locale = getPreferredLocale(request);
  if (locale === 'en') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-ui-language', locale);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    setUiLanguageCookie(request, response, locale);
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  setUiLanguageCookie(request, response, locale);
  return response;
}

export const config = {
  matcher: ['/((?!_next/|api/|offline$|offline/|sw\\.js$|workbox-).*)'],
};
