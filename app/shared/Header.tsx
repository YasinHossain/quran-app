'use client';
import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { IconSettings, IconSun, IconMoon } from '@tabler/icons-react';
import { SearchInput } from './components/SearchInput';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useTheme } from '@/app/providers/ThemeContext';
import { useSidebar } from '@/app/providers/SidebarContext';
import { cn } from '@/lib/utils';

const Header = () => {
  const { isHidden } = useHeaderVisibility();
  const { theme, setTheme } = useTheme();
  const { setSettingsOpen } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  // Check if we're on a surah page where settings sidebar is visible on desktop
  const isOnSurahPage = pathname.startsWith('/surah/') && pathname !== '/surah';

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

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 min-h-[calc(3.5rem+env(safe-area-inset-top))] sm:min-h-[calc(4rem+env(safe-area-inset-top))] z-header transition-all duration-300 pt-safe',
        'flex items-center justify-between gap-2 sm:gap-3 pl-safe pr-safe sm:pl-4 sm:pr-4 lg:pl-6 lg:pr-6',
        'border-b backdrop-blur-xl bg-background/80 border-border/10',
        isHidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      {/* Left section - Brand */}
      <Link
        href="/"
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity flex-shrink-0"
      >
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
          <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.5 2h-13C4.7 2 4 2.7 4 3.5v17l8-4 8 4v-17C20 2.7 19.3 2 18.5 2z" />
          </svg>
        </div>
        <span className="hidden sm:block font-semibold text-lg text-foreground">Quran Mazid</span>
      </Link>

      {/* Center section - Search */}
      <div className="flex-1 flex justify-center mx-2 sm:mx-4">
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
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-touch p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 active:scale-95"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <IconSun size={18} className="text-amber-500" />
          ) : (
            <IconMoon size={18} className="text-muted-foreground" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => setSettingsOpen(true)}
          className={cn(
            'btn-touch p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 active:scale-95',
            // On surah pages: only show on mobile (when sidebar is hidden)
            // On other pages: show on all screen sizes
            isOnSurahPage ? 'lg:hidden' : ''
          )}
          aria-label="Open Settings"
        >
          <IconSettings size={18} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default Header;
