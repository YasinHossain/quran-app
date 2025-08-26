'use client';
import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { IconSun, IconMoon, IconSettings, IconMenu2 } from '@tabler/icons-react';
import { SearchInput } from './components/SearchInput';
import { useHeaderVisibility } from '@/presentation/(features)/layout/context/HeaderVisibilityContext';
import { useTheme } from '@/presentation/providers/ThemeContext';
import { useUIState } from '@/presentation/providers/UIStateContext';
import { useSidebar } from '@/presentation/providers/SidebarContext';
import { cn } from '@/lib/utils';

const Header = () => {
  const { isHidden } = useHeaderVisibility();
  const { theme, setTheme } = useTheme();
  const { setSettingsOpen } = useUIState();
  const { setSurahListOpen, setBookmarkSidebarOpen } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setTheme('light');
    } else {
      html.classList.add('dark');
      setTheme('dark');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  // Check if we need to show navigation menu (for pages with sidebars)
  const showNavigationMenu =
    pathname?.startsWith('/surah') ||
    pathname?.startsWith('/tafsir') ||
    pathname?.startsWith('/juz') ||
    pathname?.startsWith('/page');
  const showBookmarkMenu = pathname?.startsWith('/bookmarks');

  const handleMobileNavClick = () => {
    if (showBookmarkMenu) {
      setBookmarkSidebarOpen(true);
    } else if (showNavigationMenu) {
      setSurahListOpen(true);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 h-[calc(3.5rem+env(safe-area-inset-top))] sm:h-[calc(4rem+env(safe-area-inset-top))] z-header transition-all duration-300',
        'backdrop-blur-lg bg-surface/8 backdrop-saturate-150',
        'border-b border-border shadow-md shadow-black/5 dark:shadow-black/10',
        'flex items-center justify-center',
        isHidden ? '-translate-y-full' : 'translate-y-0'
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Content container centered within available height */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 w-full h-14 sm:h-16 px-4 sm:px-6 lg:px-8">
        {/* Left section - Navigation & Brand */}
        <div className="flex items-center justify-start w-1/3">
          {/* Mobile Navigation Menu Button */}
          {(showNavigationMenu || showBookmarkMenu) && (
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
            <span className="hidden sm:block font-semibold text-lg text-foreground">
              Quran Mazid
            </span>
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex items-center justify-center w-1/3">
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search verses, surahs..."
              onKeyDown={handleKeyDown}
              variant="header"
              size="sm"
              className="w-full"
            />
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center justify-end space-x-1 sm:space-x-1.5 w-1/3 mr-1">
          {/* Settings button - only show on mobile/tablet when settings sidebar is hidden */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="btn-touch p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 active:scale-95 lg:hidden"
            aria-label="Open settings"
          >
            <IconSettings size={18} className="text-muted" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-touch p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <IconSun size={18} className="text-status-warning" />
            ) : (
              <IconMoon size={18} className="text-muted" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
