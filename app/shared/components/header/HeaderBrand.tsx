'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, type ReactElement, useCallback } from 'react';

import { useSidebar } from '@/app/providers/SidebarContext';
import { BarsIcon } from '@/app/shared/icons';

const LOCALE_PREFIX_RE = /^\/(en|bn)(?=\/|$)/;

const getLocaleFromPathname = (pathname: string | null): 'en' | 'bn' => {
  const match = (pathname ?? '').match(LOCALE_PREFIX_RE);
  return match?.[1] === 'bn' ? 'bn' : 'en';
};

const stripLocalePrefix = (pathname: string | null): string => {
  const stripped = (pathname ?? '').replace(LOCALE_PREFIX_RE, '');
  return stripped === '' ? '/' : stripped;
};

export const HeaderBrand = memo(function HeaderBrand(): ReactElement {
  const { setSurahListOpen, setBookmarkSidebarOpen, setSearchSidebarOpen } = useSidebar();

  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const basePathname = stripLocalePrefix(pathname);

  const isNavPath = (path?: string | null): boolean =>
    Boolean(
      path &&
      (path.startsWith('/surah') ||
        path.startsWith('/tafsir') ||
        path.startsWith('/juz') ||
        path.startsWith('/page'))
    );
  const isBookmarkPath = (path?: string | null): boolean =>
    Boolean(path && path.startsWith('/bookmarks'));
  const isSearchPath = (path?: string | null): boolean =>
    Boolean(path && path.startsWith('/search'));

  const shouldShowMenu =
    isNavPath(basePathname) || isBookmarkPath(basePathname) || isSearchPath(basePathname);

  const handleMobileNavClick = useCallback((): void => {
    if (isBookmarkPath(basePathname)) {
      setBookmarkSidebarOpen(true);
      return;
    }
    if (isSearchPath(basePathname)) {
      setSearchSidebarOpen(true);
      return;
    }
    if (isNavPath(basePathname)) {
      setSurahListOpen(true);
    }
  }, [basePathname, setBookmarkSidebarOpen, setSearchSidebarOpen, setSurahListOpen]);

  return (
    <div className="flex items-center justify-start w-auto sm:w-1/3 gap-1">
      {/* Mobile Navigation Menu Button */}
      {shouldShowMenu && (
        <button
          onClick={handleMobileNavClick}
          className="btn-touch p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 active:scale-95 xl:hidden flex items-center justify-center"
          aria-label="Open navigation"
        >
          <BarsIcon size={18} className="text-muted" />
        </button>
      )}

      {/* PC: Brand Link (Hidden on mobile) */}
      <Link
        href={`/${locale}`}
        className="hidden xl:flex items-center space-x-2 hover:opacity-80 transition-opacity ml-2"
      >
        {/* Logo Removed on PC as per request, implicitly */}
        <span className="font-semibold text-lg text-foreground">Al Quran</span>
      </Link>
    </div>
  );
});
