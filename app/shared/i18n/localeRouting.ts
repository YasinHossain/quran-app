import { isUiLanguageCode, type UiLanguageCode } from './uiLanguages';

const splitHref = (href: string): { path: string; query: string; hash: string } => {
  const [beforeHash, hashPart] = href.split('#', 2);
  const [pathPart, queryPart] = (beforeHash ?? '').split('?', 2);
  return {
    path: pathPart ?? '',
    query: queryPart ? `?${queryPart}` : '',
    hash: hashPart ? `#${hashPart}` : '',
  };
};

export const getLocaleFromPathname = (pathname: string): UiLanguageCode | null => {
  const first = String(pathname).split('/')[1];
  return first && isUiLanguageCode(first) ? first : null;
};

export const stripLocaleFromPathname = (pathname: string): string => {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname;

  const rest = String(pathname).split('/').slice(2).join('/');
  return rest ? `/${rest}` : '/';
};

export const setLocaleInPathname = (pathname: string, locale: UiLanguageCode): string => {
  const cleanPath = String(pathname || '/').startsWith('/') ? String(pathname || '/') : `/${pathname}`;
  const withoutLocale = stripLocaleFromPathname(cleanPath);
  if (locale === 'en') return withoutLocale;
  return withoutLocale === '/' ? `/${locale}` : `/${locale}${withoutLocale}`;
};

/**
 * Locale routing contract (kept as JSON so it’s easy to grep/copy during refactors):
 * {
 *   "defaultLocale": "en",
 *   "urlPrefix": { "en": "(none)", "other": "/{locale}" },
 *   "englishSwitchFlow": "/en/* -> server redirects to /* (canonical)",
 *   "persistence": ["cookie:ui-language", "localStorage:ui-language"]
 * }
 */
export const setLocaleInPathnameForSwitch = (pathname: string, locale: UiLanguageCode): string => {
  const cleanPath = String(pathname || '/').startsWith('/') ? String(pathname || '/') : `/${pathname}`;
  const withoutLocale = stripLocaleFromPathname(cleanPath);

  // For imperative language switching to English, route via `/en/...` so the server can
  // persist the selection and then canonicalize back to non-prefixed English routes.
  if (locale === 'en') return withoutLocale === '/' ? '/en' : `/en${withoutLocale}`;
  return withoutLocale === '/' ? `/${locale}` : `/${locale}${withoutLocale}`;
};

export const localizeHref = (href: string, locale: UiLanguageCode): string => {
  if (!href.startsWith('/')) return href;

  const { path, query, hash } = splitHref(href);
  const localizedPath = setLocaleInPathname(path || '/', locale);
  return `${localizedPath}${query}${hash}`;
};
