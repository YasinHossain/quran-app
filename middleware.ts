import { NextResponse, type NextRequest } from 'next/server';

const SUPPORTED_LOCALES = new Set(['en', 'bn']);

const isPublicFile = (pathname: string): boolean => pathname.includes('.') && !pathname.endsWith('/');

const shouldSkip = (pathname: string): boolean => {
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/api')) return true;
  if (pathname.startsWith('/fonts')) return true;
  if (pathname.startsWith('/sw.js')) return true;
  if (pathname.startsWith('/workbox-')) return true;
  if (pathname.startsWith('/manifest')) return true;
  if (pathname.startsWith('/icon')) return true;
  if (pathname.startsWith('/offline')) return true;
  if (pathname.startsWith('/robots.txt')) return true;
  if (pathname.startsWith('/sitemap')) return true;
  return isPublicFile(pathname);
};

const getLocaleFromCookie = (request: NextRequest): string | null => {
  const value = request.cookies.get('ui-language')?.value ?? null;
  if (value && SUPPORTED_LOCALES.has(value)) return value;
  return null;
};

const getLocaleFromPathname = (pathname: string): string | null => {
  const match = pathname.match(/^\/(en|bn)(?:\/|$)/);
  return match?.[1] ?? null;
};

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const localeInPath = getLocaleFromPathname(pathname);
  if (localeInPath) {
    return NextResponse.next();
  }

  const preferred = getLocaleFromCookie(request) ?? 'en';

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${preferred}` : `/${preferred}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next).*)'],
};

