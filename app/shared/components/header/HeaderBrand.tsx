'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, type ReactElement, useCallback } from 'react';

import { useSidebar } from '@/app/providers/SidebarContext';

export const HeaderBrand = memo(function HeaderBrand(): ReactElement {
  const { setSurahListOpen, setBookmarkSidebarOpen, setSearchSidebarOpen } = useSidebar();

  const pathname = usePathname();

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

  const shouldShowMenu = isNavPath(pathname) || isBookmarkPath(pathname) || isSearchPath(pathname);

  const handleMobileNavClick = useCallback((): void => {
    if (isBookmarkPath(pathname)) {
      setBookmarkSidebarOpen(true);
      return;
    }
    if (isSearchPath(pathname)) {
      setSearchSidebarOpen(true);
      return;
    }
    if (isNavPath(pathname)) {
      setSurahListOpen(true);
    }
  }, [pathname, setBookmarkSidebarOpen, setSearchSidebarOpen, setSurahListOpen]);

  return (
    <div className="flex items-center justify-start w-auto sm:w-1/3 gap-1">
      {/* Mobile Navigation Menu Button */}
      {shouldShowMenu && (
        <button
          onClick={handleMobileNavClick}
          className="btn-touch p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 active:scale-95 xl:hidden flex items-center justify-center"
          aria-label="Open navigation"
        >
          <Menu size={18} className="text-muted" />
        </button>
      )}

      {/* PC: Brand Link (Hidden on mobile) */}
      <Link
        href="/"
        className="hidden xl:flex items-center space-x-2 hover:opacity-80 transition-opacity ml-2"
      >
        {/* Logo Removed on PC as per request, implicitly */}
        <span className="font-semibold text-lg text-foreground">Al Quran</span>
      </Link>
    </div>
  );
});
