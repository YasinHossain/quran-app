'use client';

// eslint-disable-next-line no-restricted-imports -- the one wrapper around `usePathname`
import { usePathname } from 'next/navigation';

import { stripDefaultLocalePrefix } from './localeRouting';

/**
 * The pathname as it appears in the address bar. Use it instead of `usePathname`: English pages
 * are served from `app/[lang]` through an internal `/en/...` rewrite, so `usePathname` returns
 * `/en/surah/x` while prerendering and `/surah/x` in the browser, a hydration mismatch for
 * anything derived from it.
 */
export function usePublicPathname(): string {
  return stripDefaultLocalePrefix(usePathname());
}
