'use client';

import { IconSun, IconMoon, IconSettings } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { memo, type ReactElement, useCallback } from 'react';

import { useTheme } from '@/app/providers/ThemeContext';
import { useUIState } from '@/app/providers/UIStateContext';

export const HeaderActions = memo(function HeaderActions(): ReactElement {
  const { theme, setTheme } = useTheme();
  const { setSettingsOpen } = useUIState();
  const pathname = usePathname();

  // Settings sidebar is not present on these pages on PC, so hide the gear icon on mobile too.
  const NO_SETTINGS_SIDEBAR_ROUTES = [
    '/bookmarks',
    '/bookmarks/last-read',
    '/bookmarks/planner',
    '/search',
  ];

  const shouldHideSettings = NO_SETTINGS_SIDEBAR_ROUTES.includes(pathname);

  const toggleTheme = useCallback((): void => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setTheme('light');
    } else {
      html.classList.add('dark');
      setTheme('dark');
    }
  }, [setTheme]);

  const openSettings = useCallback((): void => {
    setSettingsOpen(true);
  }, [setSettingsOpen]);

  return (
    <div className="flex items-center justify-end gap-2 sm:gap-2.5 w-1/3 mr-1">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="btn-touch p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-accent transition-all duration-200 active:scale-95 flex items-center justify-center"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <IconSun size={18} className="text-foreground" />
        ) : (
          <IconMoon size={18} className="text-foreground" />
        )}
      </button>

      {/* Settings button - Swapped position: now right of theme toggle */}
      {!shouldHideSettings && (
        <button
          onClick={openSettings}
          className="btn-touch p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-accent transition-all duration-200 active:scale-95 xl:hidden flex items-center justify-center"
          aria-label="Open settings"
        >
          <IconSettings size={18} className="text-muted" />
        </button>
      )}
    </div>
  );
});
