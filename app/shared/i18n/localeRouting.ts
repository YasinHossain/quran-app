import { isUiLanguageCode, type UiLanguageCode } from './uiLanguages';

const normalizePathname = (pathname: string | null | undefined): string => {
  if (typeof pathname !== 'string' || pathname.length === 0) {
    return '/';
  }

  return pathname.startsWith('/') ? pathname : `/${pathname}`;
};

const splitHref = (href: string): { path: string; query: string; hash: string } => {
  const [beforeHash, hashPart] = href.split('#', 2);
  const [pathPart, queryPart] = (beforeHash ?? '').split('?', 2);
  return {
    path: pathPart ?? '',
    query: queryPart ? `?${queryPart}` : '',
    hash: hashPart ? `#${hashPart}` : '',
  };
};

export const getLocaleFromPathname = (pathname: string | null | undefined): UiLanguageCode | null => {
  const safePathname = normalizePathname(pathname);
  const first = safePathname.split('/')[1];
  const normalized = first ? first.toLowerCase() : '';
  return normalized && isUiLanguageCode(normalized) ? normalized : null;
};

export const stripLocaleFromPathname = (pathname: string | null | undefined): string => {
  const safePathname = normalizePathname(pathname);
  const locale = getLocaleFromPathname(safePathname);
  if (!locale) return safePathname;

  const rest = safePathname.split('/').slice(2).join('/');
  return rest ? `/${rest}` : '/';
};

export const setLocaleInPathname = (
  pathname: string | null | undefined,
  locale: UiLanguageCode
): string => {
  const cleanPath = normalizePathname(pathname);
  const withoutLocale = stripLocaleFromPathname(cleanPath);
  if (locale === 'en') return withoutLocale;
  return withoutLocale === '/' ? `/${locale}` : `/${locale}${withoutLocale}`;
};

export const setLocaleInPathnameForSwitch = (
  pathname: string | null | undefined,
  locale: UiLanguageCode
): string => {
  return setLocaleInPathname(pathname, locale);
};

export const localizeHref = (href: string, locale: UiLanguageCode): string => {
  if (!href.startsWith('/')) return href;

  const { path, query, hash } = splitHref(href);
  const localizedPath = setLocaleInPathname(path || '/', locale);
  return `${localizedPath}${query}${hash}`;
};
