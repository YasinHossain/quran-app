'use client';

import { IconMenu2 } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSidebar } from '@/app/providers/SidebarContext';

export function HeaderBrand(): JSX.Element {
  const { setSurahListOpen, setBookmarkSidebarOpen } = useSidebar();
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

  const shouldShowMenu = isNavPath(pathname) || isBookmarkPath(pathname);

  const handleMobileNavClick = (): void => {
    if (isBookmarkPath(pathname)) {
      setBookmarkSidebarOpen(true);
      return;
    }
    if (isNavPath(pathname)) {
      setSurahListOpen(true);
    }
  };

  return (
    <div className="flex items-center justify-start w-1/3">
      {/* Mobile Navigation Menu Button */}
      {shouldShowMenu && (
        <button
          onClick={handleMobileNavClick}
          className="btn-touch p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 active:scale-95 mr-2 lg:hidden"
          aria-label="Open navigation"
        >
          <IconMenu2 size={18} className="text-muted" />
        </button>
      )}

      <Link
        href="/"
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity ml-2"
      >
        <div className="h-8 w-8 rounded-xl bg-gradient-emerald flex items-center justify-center shadow-sm">
          <svg className="h-5 w-5 text-on-accent" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.5 2h-13C4.7 2 4 2.7 4 3.5v17l8-4 8 4v-17C20 2.7 19.3 2 18.5 2z" />
          </svg>
        </div>
        <span className="hidden sm:block font-semibold text-lg text-foreground">Quran Mazid</span>
      </Link>
    </div>
  );
}
